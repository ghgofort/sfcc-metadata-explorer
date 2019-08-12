/**
 * @file SitePreferenceNode.ts
 * @fileoverview - Exports a class that extends the base TreeNode class and is
 *    used for display of Site Preference Attributes in the Site Preferences
 *    tree node.
 */

import { TreeItemCollapsibleState, TreeItem } from 'vscode';

/**
 * @class
 * @classdesc - A TreeNode type that is used to display SitePreferences
 *    attributes when displayed by group under the `Site Preferences` base tree
 *    node.
 */
export default class SitePreferencesNode extends TreeItem {
  /**
   * @param {Object} args -
   * @constructor
   */
  constructor(label: String, collapsibleState: TreeItemCollapsibleState) {
    super(label, collapsibleState);
  }
}
