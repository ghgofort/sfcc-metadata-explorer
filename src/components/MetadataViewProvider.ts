/**
 * @file MetadataViewProvider.ts
 * @fileoverview - This file holds the MetadataViewProvider class implementation
 * which is used for getting SFCC Metadata from the sandbox instance and
 * populating the tree view instance.
 */

import { MetadataNode } from './MetadataNode';
import * as vscode from 'vscode';

export class MetadataViewProvider implements vscode.TreeDataProvider<MetadataNode> {
  onDidChangeTreeData?: vscode.Event<MetadataNode>;

  getTreeItem(element: MetadataNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    throw new Error("Method not implemented.");
  }
  getChildren(element?: MetadataNode): vscode.ProviderResult<MetadataNode[]> {
    throw new Error("Method not implemented.");
  }


}