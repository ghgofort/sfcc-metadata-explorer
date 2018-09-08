/**
 * @file MetadataNode.ts
 * @fileoverview - This file contains a class that is used for creating nodes
 * on a tree view for display of SFCC metadata objects. This is a generic class used
 */

import { Command, TreeItemCollapsibleState, TreeItem } from 'vscode';

/**
 * @class MetadataNode
 * @classdesc A generic class representing a metadata entity returned from a
 * reqeust to OCAPI.
 */
export class MetadataNode extends TreeItem {
  constructor(
    public readonly name: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
  ) {
    super(name, collapsibleState);
  }
}
