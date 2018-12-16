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
  Range,
  TreeDataProvider,
  TreeItemCollapsibleState,
  WorkspaceConfiguration,
  workspace
} from 'vscode';
import { OCAPIService } from '../service/OCAPIService';
import { ICallSetup } from '../service/ICallSetup';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
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
  async getChildren(element?: MetadataNode): Promise<MetadataNode[]> {
    const service: OCAPIService = new OCAPIService();
    let _callSetup: ICallSetup = null;
    let _callResult: any;

    try {
      /* No Element -- Root
         ==================================================================== */
      if (!element) {
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
      } else {
        // Only expandable elements types have children.
        if (element.expandable) {
          if (element.nodeType === 'baseNodeName') {
            /* Base Node -- Metdata Type
             * ============================================================== */
            // Async call to get the appropriate OCAPI type.
            _callSetup = await service.getCallSetup(
              element.baseNodeName,
              'getAll',
              {
                count: 200,
                select: '(**)'
              }
            );

            try {
              _callResult = await service.makeCall(_callSetup);
            } catch (e) {
              console.log(e);
              throw new Error(e.toString());
            }

            // If the API call returns data create a tree.
            if (_callResult.data && Array.isArray(_callResult.data)) {
              // Add the display name to the custom objects so that they can be
              // easily identified as custom.
              return _callResult.data.map(sysObj => {
                let name =
                  sysObj.object_type === 'CustomObject' &&
                  typeof sysObj.display_name !== 'undefined'
                    ? sysObj.display_name.default + ' (CustomObject)'
                    : sysObj.object_type;

                // Create a MetaDataNode instance which implements the TreeItem
                // interface and holds the data of the document type that it
                // represents.
                return new MetadataNode(
                  name,
                  TreeItemCollapsibleState.Collapsed,
                  {
                    parentId: 'root.systemObjectDefinitions',
                    objectTypeDefinition: new ObjectTypeDefinition(sysObj)
                  }
                );
              });
            }
          } else if (element.nodeType === 'objectTypeDefinition') {
            /* Object Type Definiton
             * ============================================================== */
            // Get the System/Custom Object attributes.
            _callSetup = await service.getCallSetup(
              'systemObjectDefinitions',
              'getAttributes',
              {
                select: '(**)',
                objectType: element.objectTypeDefinition.objectType
              }
            );

            // Make the call to the OCAPI Service.
            try {
              _callResult = await service.makeCall(_callSetup);
            } catch (e) {
              console.error(e);
              throw new Error(e.toString());
            }

            console.log(_callResult);

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
                    parentId:
                      'root.systemObjectDefinitions.' +
                      element.objectTypeDefinition.objectType,
                    objectAttributeDefinition: new ObjectAttributeDefinition(
                      resultObj
                    )
                  }
                );
              });
            }

            // If there is an error display a single node indicating that there
            // was a failure to load the object definitions.
            return [
              new MetadataNode(
                'Unable to load...',
                TreeItemCollapsibleState.None,
                {
                  parentId:
                    'root.systemObjectDefinitions.' +
                    element.objectTypeDefinition.objectType
                }
              )
            ];
          } else if (element.nodeType === 'objectAttributeDefinition') {
            /* Object Attribute Definiton
             * ============================================================== */
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
                      element.parentId +
                      '.' +
                      element.objectAttributeDefinition.id
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
                      element.parentId +
                      '.' +
                      element.objectAttributeDefinition.id
                  }
                );
              } else if (
                objAttrDef[key] instanceof ObjectAttributeValueDefinition
              ) {
                // == ObjectAttributeValueDefinition
                if (typeof objAttrDef[key].id !== 'undefined') {
                  return new MetadataNode(
                    key + ': ' + objAttrDef[key].id,
                    TreeItemCollapsibleState.Collapsed,
                    {
                      objectAttributeValueDefinition: objAttrDef[key],
                      parentId:
                        element.parentId +
                        '.' +
                        element.objectAttributeDefinition.id
                    }
                  );
                }
                return new MetadataNode(
                  key + ': (undefined)',
                  TreeItemCollapsibleState.None,
                  {
                    objectAttributeValueDefinition: objAttrDef[key],
                    parentId:
                      element.parentId +
                      '.' +
                      element.objectAttributeDefinition.id
                  }
                );
              }
            });
          } else if (element.nodeType === 'objectAttributeValueDefinition') {
            /* OjbectAttributeValueDefinition
             * ============================================================== */
            return Object.keys(element.objectAttributeValueDefinition).map(
              key => {
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
                      parentId:
                        element.parentId + 'objectAttributeValueDefinition'
                    }
                  );
                } else {
                  // == Localized String
                  return new MetadataNode(
                    key + ': ' + value.default,
                    TreeItemCollapsibleState.None,
                    {
                      parentId:
                        element.parentId + 'objectAttributeValueDefinition'
                    }
                  );
                }
              }
            );
          }
        } else {
          return [];
        }
      }

      // If the call did not recieve data show a message.
      /** @todo - Display message if items not found */
    } catch (e) {
      console.error(e);
      return Promise.reject(e);
    }
  }
}
