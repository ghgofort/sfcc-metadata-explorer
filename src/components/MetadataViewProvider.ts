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
  TreeItemCollapsibleState
} from 'vscode';
import { OCAPIService } from '../service/OCAPIService';
import { ICallSetup } from '../service/ICallSetup';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';

/**
 * @class MetadataViewProvider
 * @classdesc A generic tree data provider implementation that can be used for
 *    several getting data from the OCAPI service, and wiring the results to the
 *    TreeView instance.
 */
export class MetadataViewProvider
  implements TreeDataProvider<MetadataNode | undefined> {
  readonly onDidChangeTreeData?: Event<MetadataNode | undefined>;

  public providerType: string = '';
  private eventEmitter: EventEmitter<MetadataNode | undefined> = null;

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
    console.log(element);

    try {
      // If no element was passed, then refresh the root data.
      if (!element) {
        // Async calls
        _callSetup = await service.getCallSetup(
          'systemObjectDefinitions',
          'getAll',
          { select: '(**)' }
        );

        try {
          _callResult = await service.makeCall(_callSetup);
        } catch (e) {
          console.log(e);
          throw new Error(e.toString());
        }

        // If the API call returns data create a tree.
        if (_callResult.data && Array.isArray(_callResult.data)) {
          return _callResult.data.map(sysObj => {
            console.log(sysObj);
            let name =
              sysObj.object_type === 'CustomObject' &&
              typeof sysObj.display_name !== 'undefined'
                ? sysObj.display_name.default + ' (CustomObject)'
                : sysObj.object_type;

            // Create a MetaDataNode instance which implements the TreeItem
            // interface and holds the data of the document type that it
            // represents.
            return new MetadataNode(name, TreeItemCollapsibleState.Collapsed, {
              objectTypeDefinition: new ObjectTypeDefinition(sysObj)
            });
          });
        }
      } else {
        // DEGUG --- REMOVE ME
        console.log('Element was passed');

        // Only expandable elements have children.
        if (element.expandable) {
          // DEGUG --- REMOVE ME
          console.log(element.nodeType);

          /* Object Type Definiton
             ================================================================ */
          if (element.nodeType === 'objectTypeDefinition') {
            // Get the System/Custom Object attributes.
            _callSetup = await service.getCallSetup(
              'systemObjectDefinitions',
              'attributes',
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

            // If the API call returns data create the first level of a tree.
            if (!_callResult.error && _callResult.data) {
              if (_callResult.data && Array.isArray(_callResult.data)) {
                return _callResult.data.map(resultObj => {
                  return new MetadataNode(
                    resultObj.id,
                    TreeItemCollapsibleState.Collapsed,
                    {
                      objectAttributeDefinition: new ObjectAttributeDefinition(
                        resultObj
                      )
                    }
                  );
                });
              }
            }

            // If there is an error display a single node indicating that there
            // was a failure to load the object definitions.
            return [
              new MetadataNode(
                'Unable to load...',
                TreeItemCollapsibleState.None,
                {}
              )
            ];

            /* Object Attribute Definiton
             ================================================================ */
          } else if (element.nodeType === 'objectAttributeDefinition') {
            const attr: ObjectAttributeDefinition =
              element.objectAttributeDefinition;

            return Object.keys(attr).map(key => {
              if (typeof attr[key] === 'string') {
                return new MetadataNode(
                  key +' : ' + attr[key],
                  TreeItemCollapsibleState.None,
                  {}
                )
              }
            });

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
