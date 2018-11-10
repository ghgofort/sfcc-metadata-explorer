/**
 * @file MetadataNode.ts
 * @fileoverview - This file contains a class that is used for creating nodes
 * on a tree view for display of SFCC metadata objects. This is a generic class used
 */

import { Command, TreeItemCollapsibleState, TreeItem } from 'vscode';
import INodeData from '../interfaces/INodeData';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';

/**
 * @class MetadataNode
 * @extends TreeItem
 * @classdesc A generic class representing a metadata entity returned from a
 * reqeust to OCAPI. This can be an an object type, attribute group, attribute,
 * property, or value.
 */
export class MetadataNode extends TreeItem {
  // Define member properties.
  private _expandable: boolean;
  private _nodeType: string;
  objectAttributeDefinition: ObjectAttributeDefinition;
  objectAttributeGroup: ObjectAttributeGroup;
  objectTypeDefinition: ObjectTypeDefinition;
  value: string | number;

  /**
   * @static
   * @member {{definition: string, attribute: string, group: string}} nodeTypes -
   *    An object literal mapping short names for node types to their SFCC
   *    document types.
   */
  public static nodeTypes = {
    definition: 'objectTypeDefinition',
    attribute: 'objectAttributeDefinition',
    attributeValue: 'objectAttributeValueDefinition',
    group: 'objectAttributeGroup',
    value: 'value'
  }

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
    nodeData: INodeData
  ) {
    // Call the TreeNode constructor.
    super(name, collapsibleState);

    // The types of tree nodes that have child nodes.
    const expandableTypes = Object.keys(MetadataNode.nodeTypes)
      .filter(nodeType => nodeType !== 'value');

    // Loop through the nodeData Object properties to get the correct type.
    // There will only be one property, since the node can only be one of the
    // specified types.
    Object.keys(nodeData).forEach(_dataType => {
      this[_dataType] = nodeData[_dataType];
      const nodeTypeIndex = expandableTypes.findIndex(type => {
        return MetadataNode.nodeTypes[type] === _dataType;
      });
      this._nodeType = expandableTypes[nodeTypeIndex];
    });

    // Set the instance member properties for the child Class.
    this.expandable = expandableTypes.indexOf(this._nodeType) > -1;
    this[this.nodeType] = nodeData[this.nodeType];
  }

  /* Member Mutators & Accessors
     ======================================================================== */
  /** @member {boolean} expandable - Boolean for if the node is expandable. */
  get expandable(): boolean { return this._expandable; }
  set expandable(value: boolean) { this._expandable = value; }

  /** @member {string} nodeType - Readonly string for getting the node type. */
  get nodeType(): string { return MetadataNode.nodeTypes[this._nodeType]; }

  /** @member {string} tooltip - Readonly string for rendering a tooltip. */
  get tooltip(): string { return this.name; }
}
