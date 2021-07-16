'use strict';

import { commands, Disposable, ExtensionContext } from 'vscode';
import CommandCenter from './commands/CommandCenter';
import { MetadataView } from './components/MetadataView';


/**
 * The entry point for the extension. This lifecycle method is called when the
 * extension is first loaded.
 *
 * @param context - The context object used to subscribe commands with.
 */
export function activate(context: ExtensionContext) {
  // Setup view for System Object Definitions view & create CommandCenter instance.
  const metaView: MetadataView = new MetadataView(context);
  const commandCenter = new CommandCenter(metaView);
  metaView.getDataFromProvider('systemObjectDefinitions');

  // Register the VSCode commands to their callback functions.
  const commandNames: string[] = [
    'extension.sfccexplorer.objectattributegroup.addgroup',
    'extension.sfccexplorer.objectattributegroup.deletegroup',
    'extension.sfccexplorer.objectattributegroup.getxml',
    'extension.sfccexplorer.refresh',
    'extension.sfccexplorer.sitepreference.setvalue',
    'extension.sfccexplorer.systemobject.addattribute',
    'extension.sfccexplorer.systemobject.deleteattribute',
    'extension.sfccexplorer.systemobjectattribute.addtogroup',
    'extension.sfccexplorer.systemobjectattribute.getxml',
    'extension.sfccexplorer.systemobjectattribute.removefromgroup',
    'extension.sfccexplorer.systemobjectattribute.setdefault',
    'extension.sfccexplorer.systemobjects.getxml'
  ];

  // Register the commands to handlers using VSCode API.
  const disposables: Disposable[] = commandNames.map(
    cName => commands.registerCommand(cName, commandCenter.getCallback(cName)));

  // Add the event handler registered events to the context.subscriptions collection.
  disposables.forEach(disp => { context.subscriptions.push(disp); });
}

// this method is called when your extension is deactivated
export function deactivate() {
  /** @todo: Implement deactivate() lifecycle method in extension.ts */
}
