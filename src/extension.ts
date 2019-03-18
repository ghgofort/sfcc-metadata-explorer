'use strict';

import { commands, ExtensionContext, window, Disposable } from 'vscode';
import { MetadataView } from './components/MetadataView';
import OCAPIHelper from './helpers/OCAPIHelper';
import { MetadataNode } from './components/MetadataNode';
import XMLHandler from './xmlHandler/XMLHandler';

/**
 * The entry point for the extension. This lifecycle method is called when the
 * extension is first loaded.
 *
 * @param context - The context object used to subscribe commands with.
 */
export function activate(context: ExtensionContext) {
  // Setup view for System Object Definitions view.
  const metaView: MetadataView = new MetadataView(context);
  const ocapiHelper = new OCAPIHelper(metaView);
  const xmlHandler = new XMLHandler();
  metaView.getDataFromProvider('systemObjectDefinitions');

  /**
   * Binds the handler function for the event. The command has been defined in
   * the package.json file.
   *
   * @listens extension.sfccexplorer.systemobject.addattribute
   */
  const addAttributeDisposable: Disposable = commands.registerCommand(
    'extension.sfccexplorer.systemobject.addattribute',
    (metaNode: MetadataNode) => {
      ocapiHelper
        .addAttributeNode(metaNode)
        .then(data => {
          console.log(data);
          metaView.currentProvider.refresh();
        })
        .catch(err => {
          window.showErrorMessage('Unable to add attribute: {0}', err);
          console.error(err);
        });
    }
  );

  /**
   * Binds the handler function for the event. The command has been defined in
   * the package.json file.
   *
   * @listens extension.sfccexplorer.systemobject.addattribute
   */
  const deleteAttributeDisposable: Disposable = commands.registerCommand(
    'extension.sfccexplorer.systemobject.deleteattribute',
    (metaNode: MetadataNode) => {
      ocapiHelper
        .deleteAttributeDefinition(metaNode)
        .then(data => {
          window.showInformationMessage('Attribute Deleted Successfully');
          console.log(data);
          metaView.currentProvider.refresh();
        })
        .catch(err => {
          window.showErrorMessage('Unable to add attribute: {0}', err);
          console.log(err);
        });
    }
  );

  /**
   * Binds the handler for the TreeViewProvider refresh action to its handler
   * function.
   *
   * @listens extension.sfccexplorer.refresh
   */
  const refreshTreeDisposable: Disposable = commands.registerCommand(
    'extension.sfccexplorer.refresh',
    (metaDataView: any) => {
      metaView.currentProvider.refresh();
    }
  );

  /**
   * Binds the OCAPI helper method to handle the assigning of attributes to
   * attribute groups to the VSCode event.
   *
   * @listens extension.sfccexplorer.systemobjectattribute.addtogroup
   */
  const assignToGroupDisposable: Disposable = commands.registerCommand(
    'extension.sfccexplorer.systemobjectattribute.addtogroup',
    (metaNode: MetadataNode) => {
      ocapiHelper
        .assignAttributesToGroup(metaNode)
        .then(data => {
          console.log(data);
          metaView.currentProvider.refresh();
        })
        .catch(err => {
          window.showErrorMessage('Unable to add attribute: {0}', err);
          console.log(err);
        });
    }
  );

  /**
   * Binds the handler for the context menu command to set the default value of
   * a system object attribute.
   *
   * @listens extension.sfccexplorer.systemobjectattribute.setdefault
   */
  const setDefaultDisposable: Disposable = commands.registerCommand(
    'extension.sfccexplorer.systemobjectattribute.setdefault',
    (metaNode: MetadataNode) => {
      ocapiHelper
        .setDefaultAttributeValue(metaNode)
        .then(data => {
          metaView.currentProvider.refresh();
        })
        .catch(err => {
          window.showErrorMessage('Unable to set default value: {0}', err);
          console.log(err);
        });
    }
  );

  /**
   * Binds the handler for the context menu command to set the default value of
   * a system object attribute.
   *
   * @listens extension.sfccexplorer.objectattributegroup.addgroup
   */
  const addGroupDisposable: Disposable = commands.registerCommand(
    'extension.sfccexplorer.objectattributegroup.addgroup',
    (metaNode: MetadataNode) => {
      ocapiHelper
        .addAttributeGroup(metaNode)
        .then(data => {
          metaView.currentProvider.refresh();
        })
        .catch(err => {
          // If the user canceled the action, then don't show an error.
          if (typeof err.error === 'boolean' &&
            err.error === false
          ) {
            return;
          }

          window.showErrorMessage('Could not create attribute group: {0}', err);
          console.log(err);
        });
    }
  );

  /**
   * Binds the handler to the context menu action to get the XML from a system
   * object attribute definition.
   *
   * @listens extension.sfccexplorer.systemobjectattribute.getxml
   */
  const getAttributeXMLDisposable: Disposable = commands.registerCommand(
    'extension.sfccexplorer.systemobjectattribute.getxml',
    (metaNode: MetadataNode) => {

    }
  );

  context.subscriptions.push(getAttributeXMLDisposable);
  context.subscriptions.push(addGroupDisposable);
  context.subscriptions.push(assignToGroupDisposable);
  context.subscriptions.push(setDefaultDisposable);
  context.subscriptions.push(addAttributeDisposable);
  context.subscriptions.push(refreshTreeDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  /** @todo: Implement deactivate() lifecycle method in extension.ts */
}
