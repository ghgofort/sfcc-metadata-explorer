/**
 * @file MetadataNode.ts
 * @fileoverview - This file contains a class that is used for creating nodes
 * on a tree view for display of SFCC metadata objects. This is a generic class used
 */

import { Command, TreeItemCollapsibleState, TreeItem } from 'vscode';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import { ObjectTypeDefinitions } from '../documents/ObjectTypeDefinitions';

/**
 * @class MetadataNode
 * @extends TreeItem
 * @classdesc A generic class representing a metadata entity returned from a
 * reqeust to OCAPI. This can be an an object type, attribute group, attribute,
 * property, or value.
 */
export class MetadataNode extends TreeItem {
  _expandable: boolean;
  _nodeType: string;
  _objectTypeDefinition: ObjectTypeDefinition;

  /**
   * The constructor function that calls the super class constructor, and then
   * initializes the custom logic for the MetaNode class.
   *
   * @param {string} name - The name of the node to be used as a label.
   * @param {TreeItemCollapsibleState} collapsibleState - The collapsible state
   *    constant: 'Collapsed', 'Expanded', & 'None'.
   * @param {ObjectTypeDefinition | ObjectAttributeDefinition | ObjectAttributeGroup | string} value - The object type
   *    definition instance, or an empty instance if this is only a parent
   *    container.
   * @constructor
   */
  constructor(
    public readonly name: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    args: INodeData
  ) {
    super(name, collapsibleState);

    // Create the ObjectTypeDefinition member instance. Create an empty one if
    // this is a parent node.
    if (typeof args.objectTypeDefinition !== 'undefined') {
      this._objectTypeDefinition = args.objectTypeDefinition;
    }


  }

  get tooltip(): string {
    return this.name;
  }

  get expandable(): boolean {
    return this._expandable;
  }
}
