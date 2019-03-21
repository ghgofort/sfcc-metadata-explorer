/**
 * @file MetadataViewProvider.ts
 * @fileoverview - This file holds the MetadataViewProvider class implementation
 * which is used for getting SFCC Metadata from the sandbox instance and
 * populating the tree view instance.
 */

import { MetadataNode } from './MetadataNode';
import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItemCollapsibleState,
  WorkspaceConfiguration,
  workspace
} from 'vscode';
import { OCAPIService } from '../services/OCAPIService';
import { ICallSetup } from '../services/ICallSetup';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import ObjectAttributeValueDefinition from '../documents/ObjectAttributeValueDefinition';

/**
 * @class MetadataViewProvider
 * @classdesc A generic tree data provider implementation that can be used for
 *    several getting data from the OCAPI service, and wiring the results to the
 *    TreeView instance.
 */
export class MetadataViewProvider
  implements TreeDataProvider<MetadataNode | undefined> {
  // Declare memeber variables.
  readonly onDidChangeTreeData?: Event<MetadataNode | undefined>;
  public providerType: string = '';
  private eventEmitter: EventEmitter<MetadataNode | undefined> = null;
  private service: OCAPIService = new OCAPIService();

  /**
   *
   * @param {string} providerType - The type of provider being initialized;
   * @param {EventEmitter<MetadataNode | undefined>} eventEmitter
   */
  constructor(
    providerType: string,
    eventEmitter: EventEmitter<MetadataNode | undefined>
  ) {
    this.providerType = providerType;
    this.eventEmitter = eventEmitter;
    this.onDidChangeTreeData = this.eventEmitter.event;
  }

  /* ========================================================================
   * Public Instance Methods
   * ======================================================================== */

  public refresh(): void {
    this.eventEmitter.fire();
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
    try {
      if (!element) {
        // Get the base nodes of the tree.
        return this.getRootChildren(element);
      } else {
        // Get children of expandable node types
        if (element.expandable) {
          if (element.nodeType === 'baseNodeName') {
            return this.getBaseNodeChildren(element);
          } else if (element.nodeType === 'objectTypeDefinition') {
            return this.getSystemObjectChildren(element);
          } else if (element.nodeType === 'parentContainer') {
            return this.getAttributeOrGroupContainerChildren(element);
          } else if (element.nodeType === 'objectAttributeDefinition') {
            return this.getAttributeDefinitionChildren(element);
          } else if (element.nodeType === 'objectAttributeGroup') {
            return this.getAttributeGroupChildren(element);
          } else if (element.nodeType === 'objectAttributeValueDefinition') {
            return this.getAttributeValueDefinitionChildren(element);
          } else if (element.nodeType === 'stringList') {
            return this.getStringListChildren(element);
          }
        } else {
          // Return an empty array for types that are not expandable.
          return [];
        }
      }
    } catch (e) {
      return Promise.reject(e.message);
    }
  }

  /**
   * Gets the children elements of AttributeValueDefinition type nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getAttributeOrGroupContainerChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    const path = element.parentId.split('.');
    const objectType = path.pop();
    const isAttribute = element.name !== 'Attribute Groups';
    let _callSetup: ICallSetup = null;
    let _callResult: any;

    // If this is the node for attribute definitions.
    if (isAttribute) {
      // Get the System/Custom Object attributes.// Make the call to the OCAPI Service.
      try {
        _callSetup = await this.service.getCallSetup(
          'systemObjectDefinitions',
          'getAttributes',
          {
            select: '(**)',
            count: 200,
            objectType: objectType
          }
        );

        _callResult = await this.service.makeCall(_callSetup);
      } catch (e) {
        throw new Error(e.toString());
      }

      // If the API call returns data create the first level of a tree.
      if (
        !_callResult.error &&
        typeof _callResult.data !== 'undefined' &&
        Array.isArray(_callResult.data)
      ) {
        return _callResult.data.map(resultObj => {
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
          expand: 'definition',
          objectType: objectType
        }
      );

      _callResult = await this.service.makeCall(_callSetup);

      // If the API call returns data create the first level of a tree.
      if (
        !_callResult.error &&
        typeof _callResult.data !== 'undefined' &&
        Array.isArray(_callResult.data)
      ) {
        return _callResult.data.map(resultObj => {
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
   * @return {Promise<MetadataNode[]>}
   */
  private async getBaseNodeChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    const _callSetup: ICallSetup = await this.service.getCallSetup(
      element.baseNodeName,
      'getAll',
      {
        count: 200,
        select: '(**)'
      }
    );

    const _callResult = await this.service.makeCall(_callSetup);

    // If the API call returns data create a tree.
    if (_callResult.data && Array.isArray(_callResult.data)) {
      // Add the display name to the custom objects so that they can be
      // easily identified as custom.
      return _callResult.data.filter(obj => {
        return obj.object_type !== 'CustomObject';
      }).map(sysObj => {
        let name = sysObj.object_type;

        // Create a MetaDataNode instance which implements the TreeItem
        // interface and holds the data of the document type that it
        // represents.
        return new MetadataNode(name, TreeItemCollapsibleState.Collapsed, {
          parentId: 'root.systemObjectDefinitions',
          objectTypeDefinition: new ObjectTypeDefinition(sysObj),
          displayDescription: ' '
        });
      });
    }
  }

  /**
   * Gets the children the root element.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getRootChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    const metaNodes: MetadataNode[] = [];

    // Get the workspace configuration object for all configuration settings
    // related to this extension.
    const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration(
      'extension.sfccmetadata'
    );

    // Get the VSCode settings for display of each base tree node.
    const showSystemObjects: boolean = Boolean(
      workspaceConfig.get('explorer.systemobjects')
    );

    // If the user config is enabled, then show the option.
    if (showSystemObjects) {
      metaNodes.push(
        new MetadataNode(
          'System Object Definitions',
          TreeItemCollapsibleState.Collapsed,
          {
            parentId: 'root',
            baseNodeName: 'systemObjectDefinitions'
          }
        )
      );
    }

    return Promise.resolve(metaNodes);
  }

  /**
   * Gets the children elements of AttributeValueDefinition type nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getSystemObjectChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    const displayTextMap = {
      objectAttributeDefinitions: 'Attribute Definitions',
      objectAttributeGroups: 'Attribute Groups'
    };

    // Setup parent nodes for the attribute definition & the attribute
    // Group nodes to be added to.
    return Object.keys(displayTextMap).map(ctnrName => {
      const metaNode = new MetadataNode(
        displayTextMap[ctnrName],
        TreeItemCollapsibleState.Collapsed,
        {
          displayDescription:
            ctnrName === 'objectAttributeDefinitions'
              ? element.objectTypeDefinition.attributeDefinitionCount.toString()
              : element.objectTypeDefinition.attributeGroupCount.toString(),
          parentContainer: ctnrName,
          parentId:
            element.parentId + '.' + element.objectTypeDefinition.objectType
        }
      );

      return metaNode;
    });
  }

  /**
   * Gets the children elements of AttributeValueDefinition type nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getAttributeValueDefinitionChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    return Object.keys(element.objectAttributeValueDefinition).map(key => {
      const value = element.objectAttributeValueDefinition[key];

      if (
        typeof value === 'string' ||
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
    const hasAttributes = attrGroup.attributeDefinitionsCount > 0;

    // Attribute Definitions
    if (hasAttributes) {
      const attrDefTitles = attrGroup.attributeDefinitions.map(
        attrDef => attrDef.id
      );

      childNodes.push(
        new MetadataNode('Attributes', TreeItemCollapsibleState.Collapsed, {
          parentId: element.parentId + '.' + element.id,
          stringList: attrDefTitles,
          displayDescription: attrGroup.attributeDefinitionsCount.toString()
        })
      );
    }

    const nodeMap: Object = {
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
          displayDescription: attrGroup[property]
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
    const objAttrDef: ObjectAttributeDefinition =
      element.objectAttributeDefinition;

    // Loop through the member properties and handle each possible type
    // for display as a node on the tree.
    return Object.keys(objAttrDef).map(key => {
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
              element.parentId + '.' + element.objectAttributeDefinition.id
          }
        );
      } else if (
        // == Localized Strings
        typeof objAttrDef[key] === 'object' &&
        objAttrDef[key] !== null &&
        typeof objAttrDef[key].default === 'string'
      ) {
        return new MetadataNode(
          key + ' : ' + objAttrDef[key].default,
          TreeItemCollapsibleState.None,
          {
            parentId:
              element.parentId + '.' + element.objectAttributeDefinition.id
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
                element.parentId + '.' + element.objectAttributeDefinition.id
            }
          );
        }
        return new MetadataNode(
          key + ': (undefined)',
          TreeItemCollapsibleState.None,
          {
            objectAttributeValueDefinition: objAttrDef[key],
            parentId:
              element.parentId + '.' + element.objectAttributeDefinition.id
          }
        );
      }
    });
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
          parentId: element.parentId + '.' + element.name
        })
    );
  }
}
