/**
 * @file MetadataViewProvider.ts
 * @fileoverview - This file holds the MetadataViewProvider class implementation
 * which is used for getting SFCC Metadata from the sandbox instance and
 * populating the tree view instance.
 */

import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItemCollapsibleState,
  workspace,
  WorkspaceConfiguration
} from 'vscode';
import IRootNodeConfiguration from '../interfaces/IRootNodeConfiguration';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import ObjectAttributeValueDefinition from '../documents/ObjectAttributeValueDefinition';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import OCAPIHelper from '../helpers/OCAPIHelper';
import SitePreferencesHelper from '../helpers/SitePreferencesHelper';
import { IOCAPITypes } from '../interfaces/IOCAPITypes';
import { ICallSetup } from '../interfaces/ICallSetup';
import { OCAPIService } from '../services/OCAPIService';
import { MetadataNode } from './MetadataNode';

interface INodeMap {
  [index: string]: string;
}

/**
 * @class MetadataViewProvider
 * @classdesc A generic tree data provider implementation that can be used for
 *    several getting data from the OCAPI service, and wiring the results to the
 *    TreeView instance.
 */
export class MetadataViewProvider
  implements TreeDataProvider<MetadataNode | undefined | null | void> {
  // Declare memeber variables.
  public readonly onDidChangeTreeData?: Event<MetadataNode | undefined | null | void>;
  private eventEmitter: EventEmitter<MetadataNode | undefined | null | void>;
  private ocapiHelper = new OCAPIHelper();
  private service: OCAPIService = new OCAPIService();

  // Defines the types of available root nodes.
  public static ROOT_NODE_TYPES: IRootNodeConfiguration[] = [
    { type: 'systemobjects', displayValue: 'System Objects', baseNodeName: 'systemObjectDefinitions' }, 
    { type: 'customobjects', displayValue: 'Custom Object Definitions', baseNodeName: 'customObjectDefinitions' }, 
    { type: 'sitepreferences', displayValue: 'Site Preferences', baseNodeName: 'sitePreferences' }, 
    { type: 'jobs', displayValue: 'SFCC Jobs', baseNodeName: 'jobs' }
  ];

  /**
   *
   * @param {string} providerType - The type of provider being initialized;
   * @param {EventEmitter<MetadataNode | undefined>} eventEmitter
   */
  constructor(
    eventEmitter: EventEmitter<MetadataNode | undefined | null | void >
    ) {
    this.eventEmitter = eventEmitter;
    this.onDidChangeTreeData = this.eventEmitter.event;
  }

  /* ========================================================================
   * Public Instance Methods
   * ======================================================================== */

  /**
   * Refreshes the TreeView.
   */
  public refresh(): void {
    this.eventEmitter.fire(null);
  }

  /**
   * Returns the individual TreeItem instance
   * @param {MetadataNode} element - The element associated with the given
   *    TreeItem instance.
   * @return {TreeItem | Thenable<TreeItem>} - Returns the instance of the
   *    TreeItem or a Promise that resolves to the TreeItem instance.
   */
  public getTreeItem(element: MetadataNode): MetadataNode {
    return element;
  }

  /**
   * Gets the children elements that are bound to the TreeItem instances for
   * rendering of the TreeView instance.
   * @param {MetadataNode} [element] - An optional parameter to use as the
   *    starting point for expansion of the tree when selected.
   * @return {Promise<MetadataNode[]>}
   */
  public async getChildren(element?: MetadataNode): Promise<MetadataNode[]> {
    const spHelper = new SitePreferencesHelper(this.service);
    try {
      if (!element) {
        // Get the base nodes of the tree.
        return this.getRootChildren();
      } else {
        // Get children of expandable node types
        if (element.expandable) {
          const nodeType = element.nodeType;
          const root = element.rootTree;

          if (root === MetadataNode.ROOT_NODES.sitePrefs &&
            nodeType === 'objectAttributeDefinition'
          ) {
            return spHelper.getSitePreferenceSites(element);
          } else if (nodeType === 'site') {
            return spHelper.getSitePreference(element);
          } else if (nodeType === 'baseNodeName') {
            return this.getBaseNodeChildren(element);
          } else if (nodeType === 'objectTypeDefinition') {
            return this.getObjectDefinitionChildren(element);
          } else if (nodeType === 'parentContainer') {
            return this.getAttributeOrGroupContainerChildren(element);
          } else if (nodeType === 'objectAttributeDefinition') {
            return this.getAttributeDefinitionChildren(element);
          } else if (nodeType === 'objectAttributeGroup') {
            // If getting the site preferences, then use helper, otherwise call
            // local class instance method.
            return element.parentId === 'sitePreferences' ?
              spHelper.getPreferencesInGroup(element) :
              this.getAttributeGroupChildren(element);
          } else if (nodeType === 'objectAttributeValueDefinition') {
            return this.getAttributeValueDefinitionChildren(element);
          } else if (nodeType === 'objectAttributeValueDefinitions') {
            return this.ocapiHelper.getValueDefinitionNodes(element);
          } else if (nodeType === 'stringList') {
            return this.getStringListChildren(element);
          }
        } else {
          // Return an empty array for types that are not expandable.
          return [];
        }
      }
    } catch (e: any) {
      return Promise.reject(e.message);
    }
    return Promise.reject('An Unexpected Error Occurred!');
  }

  /**
   * Gets the children elements of parent container type nodes. This
   * method calls OCAPI to get attribute definitions or the attribute groups
   * depending on which node was expanded. This method is used for both custom &
   * system type object definitions.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>} - Returns a promise that will resolve to
   *    the child MetadataNodes array.
   */
  private async getAttributeOrGroupContainerChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    const path = element.parentId.split('.');
    const objectType = path.pop();
    const parentType = path.pop() || '';
    const isAttribute = element.name !== 'Attribute Groups';
    let _callSetup: ICallSetup;
    let _callResult: any;

    // If this is the node for attribute definitions.
    if (isAttribute) {
      // Get the System/Custom Object attributes.// Make the call to the OCAPI Service.
      try {
        _callSetup = await this.service.getCallSetup(
          parentType,
          'getAttributes',
          {
            count: 700,
            objectType,
            select: '(**)'
          }
        );

        _callResult = await this.service.makeCall(_callSetup);
      } catch (e: any) {
        throw new Error('Error Calling OCAPI to add definition');
      }

      // If the API call returns data create the first level of a tree.
      if (
        !_callResult.error &&
        typeof _callResult.data !== 'undefined' &&
        Array.isArray(_callResult.data)
      ) {
        return _callResult.data.map((resultObj: { id: string; display_name: { default: string | undefined; }; }): MetadataNode => {
          if (resultObj) {
            return new MetadataNode(
              resultObj.id,
              TreeItemCollapsibleState.Collapsed,
              {
                parentId: element.parentId + '.' + objectType,
                objectAttributeDefinition: new ObjectAttributeDefinition(
                  resultObj
                ),
                displayDescription: resultObj.display_name
                  ? resultObj.display_name.default
                  : ''
              }
            );
          }

          return new MetadataNode(
            'ERROR',
            TreeItemCollapsibleState.Collapsed,
            {
              parentId: element.parentId + '.' + 'ERROR',
              objectAttributeDefinition: new ObjectAttributeDefinition({}),
              displayDescription: 'There wasn an error calling the API',
            }
          );
        });
      }

      // If there is an error display a single node indicating that there
      // was a failure to load the object definitions.
      return [
        new MetadataNode('Unable to load...', TreeItemCollapsibleState.None, {
          parentId: 'root.systemObjectDefinitions.' + objectType
        })
      ];
    } else {
      // Make the call to the OCAPI Service to get the attribute groups.
      // Tree branch for attribute groups.
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitions',
        'getAttributeGroups',
        {
          select: '(**)',
          count: 150,
          expand: 'definition',
          objectType
        }
      );

      _callResult = await this.service.makeCall(_callSetup);

      // If the API call returns data create the first level of a tree.
      if (!_callResult.error &&
        typeof _callResult.data !== 'undefined' &&
        Array.isArray(_callResult.data)
      ) {
        return _callResult.data.map((resultObj: { id: string; display_name: { default: string | undefined; }; }) => {
          return new MetadataNode(
            resultObj.id,
            TreeItemCollapsibleState.Collapsed,
            {
              parentId: element.parentId + '.' + objectType,
              objectAttributeGroup: new ObjectAttributeGroup(resultObj),
              displayDescription: resultObj.display_name
                ? resultObj.display_name.default
                : ''
            }
          );
        });
      } else if (
        !_callResult.error &&
        typeof _callResult.count !== 'undefined' &&
        _callResult.count === 0
      ) {
        // If there are no attribute groups defined then create a single node
        // with a message for the user.
        return [
          new MetadataNode(
            'No attribute groups defined',
            TreeItemCollapsibleState.None,
            {
              parentId: element.parentId + '.' + objectType
            }
          )
        ];
      }

      // If there is an error display a single node indicating that there
      // was a failure to load the object definitions.
      return [
        new MetadataNode('Unable to load...', TreeItemCollapsibleState.None, {
          parentId: element.parentId + '.' + objectType
        })
      ];
    }
  }

  /**
   * Gets the children elements of base tree nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>} - Returns a promise that will resolve to
   *    the child MetadataNodes array.
   */
  private async getBaseNodeChildren(
    element: MetadataNode
  ): Promise<any> {
    const baseName = element.baseNodeName;

    const callDataObj =  {
      count: 500,
      select: '(**)'
    };

    if (baseName === 'sitePreferences') {
      const spHelper = new SitePreferencesHelper(this.service);
      return await spHelper.getAllPreferences();
    }

    const _callSetup: ICallSetup = await this.service.getCallSetup(
      baseName,
      'getAll',
      callDataObj
    );

    // Call the OCAPI service.
    const _callResult = await this.service.makeCall(_callSetup);

    // If the API call returns data create a tree.
    if (_callResult.data && Array.isArray(_callResult.data)) {
      // Add the display name to the custom objects so that they can be
      // easily identified as custom.
      return _callResult.data.filter((obj: { object_type: string; display_name: any; }) => {
        return baseName === 'systemObjectDefinitions' ?
          (obj.object_type !== 'CustomObject') :
          (obj.object_type === 'CustomObject' && obj.display_name);
      }).map((filterdObj: { object_type: string; display_name: { default: string; }; }) => {
        // Get the display name for the tree node.
        let name = '';
        if (baseName === 'systemObjectDefinitions') {
          name = filterdObj.object_type;
        } else if (baseName === 'customObjectDefinitions') {
          name = filterdObj.display_name.default;
        }

        // Create a MetaDataNode instance which implements the TreeItem
        // interface and holds the data of the document type that it
        // represents.
        return new MetadataNode(name, TreeItemCollapsibleState.Collapsed, {
          parentId: 'root.' + baseName,
          objectTypeDefinition: new ObjectTypeDefinition(filterdObj),
          displayDescription: ' '
        });
      });
    }
  }

  /**
   * Gets the base nodes of the tree that can be expanded for viewing data types.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>} - Returns a promise that will resolve to
   *    the child MetadataNodes array.
   */
  private async getRootChildren(): Promise<MetadataNode[]> {
    const metaNodes: MetadataNode[] = [];

    // Get the workspace configuration object for all configuration settings
    // related to this extension.
    const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration(
      'extension.sfccmetadata'
    );

    // Add enabled root nodes to tree. 
    MetadataViewProvider.ROOT_NODE_TYPES.forEach(
      obj => {
        // If VSCode config enabled, add root node to tree.
        if (workspaceConfig.get('explorer.' + obj.type)) {
          metaNodes.push(
            new MetadataNode(
              obj.displayValue,
              TreeItemCollapsibleState.Collapsed,
              {
                parentId: 'root',
                baseNodeName: obj.baseNodeName
              }
            )
          );
        }
      }
    );

    return Promise.resolve(metaNodes);
  }

  /**
   * Gets the children elements of System & Custom object type nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getObjectDefinitionChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    const displayTextMap: {[key: string]: string}= {
      objectAttributeDefinitions: 'Attribute Definitions',
      objectAttributeGroups: 'Attribute Groups'
    };

    if (!element.objectTypeDefinition) {
      return Promise.reject('Object Type Not Found')
    } else {
      const objTD: ObjectTypeDefinition = element.objectTypeDefinition;
      // Setup parent nodes for the attribute definition & the attribute
      // Group nodes to be added to.
      return Object.keys(displayTextMap).map(ctnrName => {
        const metaNode = new MetadataNode(
          displayTextMap[ctnrName],
          element.parentId.indexOf('customObjectDefinitions') > -1 ?
            TreeItemCollapsibleState.None :
            TreeItemCollapsibleState.Collapsed,
            {
              displayDescription: ctnrName === 'objectAttributeDefinitions'
                  ? objTD.attributeDefinitionCount.toString()
                  : objTD.attributeGroupCount.toString(),
              parentContainer: ctnrName,
              parentId:
                element.parentId + '.' + objTD.objectType
            }
        );

        return metaNode;
      });
    }

  }

  /**
   * Gets the children elements of AttributeValueDefinition type nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getAttributeValueDefinitionChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    if (!element.objectAttributeValueDefinition) {
      return Promise.reject('ObjectAttributeValueDefinition Not Found');
    } else {
      const objValDef = element.objectAttributeValueDefinition;
      return Object.keys(objValDef).map(key => {
        const value = objValDef[key];

        if (typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          // == Primitive Types
          return new MetadataNode(
            key + ': ' + value,
            TreeItemCollapsibleState.None,
            {
              parentId: element.parentId + 'objectAttributeValueDefinition'
            }
          );
        } else {
          // == Localized String
          return new MetadataNode(
            key + ': ' + value.default,
            TreeItemCollapsibleState.None,
            {
              parentId: element.parentId + 'objectAttributeValueDefinition'
            }
          );
        }
      });
    }
  }

  /**
   * Gets the children elements of ObjectAttributeGroup type nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getAttributeGroupChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    const childNodes: MetadataNode[] = [];
    const attrGroup = element.objectAttributeGroup;
    if (!attrGroup) {
      return Promise.reject('Unable to find Attribute Group Chilren');
    } else {
      const hasAttributes = attrGroup.attributeDefinitionsCount > 0;

      // Attribute Definitions
      if (hasAttributes) {
        const attrDefTitles = attrGroup.attributeDefinitions.map(
          attrDef => attrDef.id
        );

        childNodes.push(
          new MetadataNode('Attributes', TreeItemCollapsibleState.Collapsed, {
            parentId: element.parentId + '.' + attrGroup.id,
            stringList: attrDefTitles,
            displayDescription: attrGroup.attributeDefinitionsCount.toString()
          })
      );
      }
    }

    const nodeMap: INodeMap = {
      displayName: 'display name'
    };

    [
      'id',
      'description',
      'displayName',
      'internal',
      'position',
      'link'
    ].forEach(property => {
      const propertyNode: MetadataNode = new MetadataNode(
        nodeMap[property] || property,
        TreeItemCollapsibleState.None,
        {
          parentId: element.parentId + '.' + attrGroup.id,
          displayDescription: element[property]
        }
      );

      childNodes.push(propertyNode);
    });

    return Promise.resolve(childNodes);
  }

  /**
   * Gets the children elements of ObjectAttributeDefinition type nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getAttributeDefinitionChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    if (!element.objectAttributeDefinition) {
      return Promise.reject('Unable to Find ObjectAttributeDefinition');
    } else {
      let objAttrDef: ObjectAttributeDefinition = element.objectAttributeDefinition;

      // Check if the attribute is an Enum type.
      if (objAttrDef.valueType.indexOf('enum') > -1) {
        // Call OCAPI to get the value definitions of the attribute.
        const attrAPIObj = await this.ocapiHelper.getExpandedAttribute(element);

        if (attrAPIObj) {
          objAttrDef = new ObjectAttributeDefinition(attrAPIObj);
        }
      }

      // Loop through the member properties and handle each possible type
      // for display as a node on the tree.
      return Object.keys(objAttrDef).filter(key => {
          return key !== 'MEMBER_MAP' && !!objAttrDef[key];
        }).map(key => {
        if (!objAttrDef[key]) {
          return new MetadataNode('ERROR: Error getting attribute group child node.',
            TreeItemCollapsibleState.None,
            { parentId: element.parentId + '.error' }
          );
        } else {
          // == Primitive Types
          if (
            typeof objAttrDef[key] === 'string' ||
            typeof objAttrDef[key] === 'number' ||
            typeof objAttrDef[key] === 'boolean'
          ) {
            return new MetadataNode(
              key + ' : ' + objAttrDef[key],
              TreeItemCollapsibleState.None,
              {
                parentId:
                  element.parentId + '.' + objAttrDef.id
              }
            );
          } else if (
            // == Localized Strings
            typeof objAttrDef[key] === 'object' &&
            objAttrDef[key] !== null &&
            Object.keys(objAttrDef[key]).includes('default')
          ) {
            const defaultVal: IOCAPITypes.ILocalizedString = {
              default: objAttrDef[key].default,
            };
            return new MetadataNode(
              key + ' : ' + defaultVal.default,
              TreeItemCollapsibleState.None,
              {
                parentId:
                  element.parentId + '.' + objAttrDef.id
              }
            );
          } else if (objAttrDef[key] instanceof ObjectAttributeValueDefinition) {
            // == ObjectAttributeValueDefinition
            if (typeof objAttrDef[key].id !== 'undefined') {
              return new MetadataNode(
                key + ': ' + objAttrDef[key].id,
                TreeItemCollapsibleState.Collapsed,
                {
                  objectAttributeValueDefinition: objAttrDef[key],
                  parentId:
                    element.parentId + '.' + objAttrDef.id
                }
              );
            }
            return new MetadataNode(
              key + ': (undefined)',
              TreeItemCollapsibleState.None,
              {
                objectAttributeValueDefinition: objAttrDef[key],
                parentId:
                  element.parentId + '.' + objAttrDef.id
              }
            );
          } else if (Array.isArray(objAttrDef[key])) {
              // == ObjectAttributeValueDefinition[]
              return new MetadataNode('Value Definitions',
                TreeItemCollapsibleState.Collapsed,
                {
                  objectAttributeValueDefinitions: objAttrDef[key],
                  parentId: element.parentId + '.' + objAttrDef.id
                }
              );
          } else {
            return new MetadataNode('ERROR: Error getting attribute group child node.',
            TreeItemCollapsibleState.None,
              { parentId: element.parentId + '.error' }
            );
          }
        }
      });
    }

  }

  /**
   * Gets the children elements simple string array type nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getStringListChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    return element.stringList.map(
      str =>
        new MetadataNode(str, TreeItemCollapsibleState.None, {
          parentId: element.parentId + '.' + element.name,
          groupAttribute: element.parentId.split('.').pop()
        })
    );
  }
}
