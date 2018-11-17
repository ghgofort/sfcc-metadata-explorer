'use strict';

import { commands, ExtensionContext, window, Disposable } from 'vscode';
import { MetadataView } from './components/MetadataView';
import OCAPIHelper from './helpers/OCAPIHelper';

/**
 * The entry point for the extension. This lifecycle method is called when the
 * extension is first loaded.
 *
 * @param context - The context object used to subscribe commands with.
 */
export function activate(context: ExtensionContext) {
  // Setup view for System Object Definitions view.
  const metaView: MetadataView = new MetadataView(context);
  metaView.getDataFromProvider('systemObjectDefinitions');

  /**
   * Binds the handler function for the event. The command has been defined in
   * the package.json file.
   *
   * @listens extension.sfccexplorer.systemobjectattribute.add
   */
  const addAttributeDisposable: Disposable = commands.registerCommand(
    'extension.sfccexplorer.systemobjectattribute.add',
      OCAPIHelper.addAttributeNode);

  context.subscriptions.push(addAttributeDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  /** @todo: Implement deactivate() lifecycle method in extension.ts */
}
