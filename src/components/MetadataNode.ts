/**
 * @file MetadataNode.ts
 * @fileoverview - This file contains a class that is used for creating nodes
 * on a tree view for display of SFCC metadata objects. This is a generic class used
 */

import { TreeItemCollapsibleState, TreeItem } from 'vscode';
import INodeData from '../interfaces/INodeData';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import ObjectAttributeValueDefinition from '../documents/ObjectAttributeValueDefinition';

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
  private _rootTree: string;
  public baseNodeName: string;
  public objectAttributeDefinition: ObjectAttributeDefinition;
  public objectAttributeGroup: ObjectAttributeGroup;
  public objectAttributeValueDefinition: ObjectAttributeValueDefinition;
  public objectTypeDefinition: ObjectTypeDefinition;
  public parentContainer: string;
  public parentId: string;
  public stringList: string[];
  public value: string | number;
  public displayDescription: string;
  public preferenceValue: string;

  /**
   * @static
   * @member {{definition: string, attribute: string, group: string}} nodeTypes -
   *    An object literal mapping short names for node types to their SFCC
   *    document types.
   */
  public static nodeTypes = {
    attribute: 'objectAttributeDefinition',
    attributeValue: 'objectAttributeValueDefinition',
    baseNodeName: 'baseNodeName',
    definition: 'objectTypeDefinition',
    group: 'objectAttributeGroup',
    groupAttribute: 'groupAttribute',
    parentContainer: 'parentContainer',
    preferenceValue: 'preferenceValue',
    sitePreference: 'sitePreference',
    sites: 'sites',
    stringList: 'stringList',
    value: 'value'
  }

  public static ROOT_NODES = {
    default: 'systemObjectDefinitions',
    sitePrefs: 'sitePreferences',
    custObjDefs: 'customObjectDefinitions'
  };

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
    const instance = this;

    instance._rootTree = MetadataNode.ROOT_NODES.default;

    // The types of tree nodes that have child nodes.
    const expandableTypes = Object.keys(MetadataNode.nodeTypes)
      .filter(nodeType => nodeType !== 'value');

    // Loop through the nodeData Object properties to get the correct type.
    // There will only be one property, since the node can only be one of the
    // specified types.
    Object.keys(nodeData)
      .filter(attrName => attrName !== 'parentId' &&
        attrName !== 'displayDescription')
      .forEach(_dataType => {
        instance[_dataType] = nodeData[_dataType];
        const nodeTypeIndex = expandableTypes.findIndex(type => {
          return MetadataNode.nodeTypes[type] === _dataType;
        });
        instance._nodeType = expandableTypes[nodeTypeIndex];
        instance.contextValue = expandableTypes[nodeTypeIndex];
      }
    );

    // Set the instance member properties for the child Class.
    this._expandable = expandableTypes.indexOf(this._nodeType) > -1;
    this.parentId = nodeData.parentId;
    this.displayDescription = nodeData.displayDescription || '';
  }

  /* Member Mutators & Accessors
     ======================================================================== */
  /** @member {boolean} expandable - Boolean for if the node is expandable. */
  get expandable(): boolean { return this._expandable; }
  set expandable(value: boolean) { this._expandable = value; }

  /** @member {string} nodeType - Readonly string for getting the node type. */
  get nodeType(): string { return MetadataNode.nodeTypes[this._nodeType]; }

  /** @member {string} rootTree - The root node that the node originates from. */
  get rootTree () { return this._rootTree; }
  set rootTree (value) { this._rootTree = value; }

  /** @member {string} tooltip - Readonly string for rendering a tooltip. */
  get tooltip(): string { return this.name; }
  get description(): string { return this.displayDescription || '' }
}
