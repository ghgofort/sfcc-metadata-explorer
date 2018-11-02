'use strict';

import { commands, ExtensionContext, window } from 'vscode';
import { MetadataView } from './components/MetadataView';

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


  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = commands.registerCommand(
    'extension.sfccexplorer.getobjects',
    () => {

      // Display a message box to the user
      window.showInformationMessage('Hello World!');
      console.log('hello from the other side');
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  /** @todo: Implement deactivate() lifecycle method in extension.ts */
}
