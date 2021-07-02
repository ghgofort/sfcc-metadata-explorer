/**
 * @file MetadataNode.ts
 * @fileoverview - This file contains a class that is used for creating nodes
 * on a tree view for display of SFCC metadata objects. This is a generic class used
 */

import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import ObjectAttributeValueDefinition from '../documents/ObjectAttributeValueDefinition';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import Sites from '../documents/Sites';
import { INodeData, INodeTypes, IPreferenceValue, IPreferenceValueDefinition } from '../interfaces/INodeData';

/**
 * @class MetadataNode
 * @extends TreeItem
 * @classdesc A generic class representing a metadata entity returned from a
 * reqeust to OCAPI. This can be an an object type, attribute group, attribute,
 * property, or value.
 */
export class MetadataNode extends TreeItem {
  [key: string]: any;
  public baseNodeName: string = '';
  public objectAttributeDefinition: ObjectAttributeDefinition|null = null;
  public objectAttributeGroup: ObjectAttributeGroup|null = null;
  public objectAttributeValueDefinition: ObjectAttributeValueDefinition|null = null;
  public objectAttributeValueDefinitions: ObjectAttributeValueDefinition[] = [];
  public objectTypeDefinition: ObjectTypeDefinition|null = null;
  public parentContainer: string = '';
  public parentId: string;
  public preferenceValueDefinitions: IPreferenceValueDefinition[] = [];
  public sites: Sites[] = [];
  public stringList: string[] = [];
  public value: string | number = '';
  public preferenceValue: IPreferenceValue|null = null;

  // Define member properties.
  private _expandable: boolean;
  private _nodeType: string = '';
  private _rootTree: string = '';

  /**
   * @static
   */
  public static nodeTypes: INodeTypes = {
    attribute: 'objectAttributeDefinition',
    attributeValue: 'objectAttributeValueDefinition',
    attributeValues: 'objectAttributeValueDefinitions',
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
  };

  public static ROOT_NODES = {
    custObjDefs: 'customObjectDefinitions',
    default: 'systemObjectDefinitions',
    sitePrefs: 'sitePreferences',
    jobs: 'jobs'
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
    this.description = this.displayDescription;
    this.tooltip = name;
  }

  /* Member Mutators & Accessors
     ======================================================================== */
  /** @member {boolean} expandable - Boolean for if the node is expandable. */
  get expandable(): boolean { return this._expandable; }
  set expandable(value: boolean) { this._expandable = value; }

  /** @member {string} nodeType - Readonly string for getting the node type. */
  get nodeType(): string { return MetadataNode.nodeTypes[this._nodeType]; }

  /** @member {string} rootTree - The root node that the node originates from. */
  get rootTree() { return this._rootTree; }
  set rootTree(value) { this._rootTree = value; }

  /** @member {string} displayDescription - Used to set the description dynamically. */
  get displayDescription(): string { return this.displayDescription || ''; }
  set displayDescription(value) { 
    this.displayDescription = value;
    this.description = value;
  }
}
