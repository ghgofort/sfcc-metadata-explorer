/**
 * @file SitePreferenceNode.ts
 * @fileoverview - Exports a class that extends the base TreeNode class and is
 *    used for display of Site Preference Attributes in the Site Preferences
 *    tree node.
 */

import { TreeItemCollapsibleState } from 'vscode';
import { INodeData } from '../interfaces/INodeData';
import { MetadataNode } from './MetadataNode';

/**
 * @class
 * @classdesc - A TreeNode type that is used to display SitePreferences
 *    attributes when displayed by group under the `Site Preferences` base tree
 *    node.
 */
export class SitePreferencesNode extends MetadataNode {
  private _type: string;

  /**
   * @param {Object} args -
   * @constructor
   */
  constructor(
    public readonly name: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    nodeData: INodeData
  ) {
    super(name, collapsibleState, nodeData);

    const instance = this;

    // Set the instance member properties for the child Class.
    instance._type = instance.objectAttributeDefinition.valueType;
    instance.displayDescription =
      instance.objectAttributeDefinition.displayName.default;
    instance.rootTree = MetadataNode.ROOT_NODES.sitePrefs;
  }

  /* Member Mutators & Accessors
     ======================================================================== */
  /** @member {boolean} expandable - Readonly boolean for if the node is expandable. */
  get expandable(): boolean {
    return true;
  }
  /** @member {string} type - Readonly string for getting the attribute type. */
  get type(): string {
    return this._type;
  }
  /** @member {string} tooltip - Readonly string for rendering a tooltip. */
  get tooltip(): string {
    return this.objectAttributeDefinition.description.default;
  }
}
