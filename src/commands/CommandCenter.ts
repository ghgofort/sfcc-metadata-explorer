/**
 * CommandCenter.ts
 * Handles the VSCode API command callback methods used when the command is invoked.
 */

import { window } from "vscode";
import { MetadataNode } from "../components/MetadataNode";
import { MetadataView } from "../components/MetadataView";
import CommandHelper from "../helpers/CommandHelper";
import OCAPIHelper from "../helpers/OCAPIHelper";
import XMLHandler from "../xmlHandler/XMLHandler";

export default class CommandCenter {
  private commandHelper: CommandHelper = new CommandHelper();
  private ocapiHelper: OCAPIHelper = new OCAPIHelper();
  private view: MetadataView;
  private xmlHandler: XMLHandler = new XMLHandler();

  constructor(metaView: MetadataView) {
    this.view = metaView;
  }

  /**
   * Gets the callback function for the specified command name to register for the extension.
   * @param {string} commandName - The full command name used in package.json to register command.
   * @returns {(...args: any[]) => any} - Returns the callback if found, or null if not.
   */
  public getCallback(commandName: string) {
    const commandHelper = this.commandHelper;
    const metaView = this.view;
    const ocapiHelper = this.ocapiHelper;
    const xmlHandler = this.xmlHandler;

    /** Switch statement handles getting of each of the VSCode event callback function. */
    switch (commandName) {
      /** Handles adding a new attribute group to system object.
       *  @listens extension.sfccexplorer.objectattributegroup.addgroup */
      case 'extension.sfccexplorer.objectattributegroup.addgroup':
        return (metaNode: MetadataNode) => {
          ocapiHelper
            .addAttributeGroup(metaNode)
            .then(data => {
              window.showInformationMessage('Attribute group added successfully.');
              metaView.currentProvider.refresh();
            })
            .catch(err => {
              // If the user canceled the action, then don't show an error.
              if (typeof err.error === 'boolean' && err.error === false) {
                return;
              }
              window.showErrorMessage('Could not create attribute group: {0}', err);
              console.log(err);
            });
        };

      /** Handles deleting a system object attribute group.
       *  @listens extension.sfccexplorer.objectattributegroup.deletegroup */
      case 'extension.sfccexplorer.objectattributegroup.deletegroup':
        return (metaNode: MetadataNode) => {
          ocapiHelper
            .deleteAttributeGroup(metaNode)
            .then(data => {
              window.showInformationMessage('Attribute group deleted successfully.');
              metaView.currentProvider.refresh();
            })
            .catch(err => {
              // If the user canceled the action, then don't show an error.
              if (typeof err.error === 'boolean' && err.error === false) { return; }
              window.showErrorMessage('Could not delete attribute group:' + JSON.stringify(err));
              console.log(err);
            });
        };

      /** Handles creation of XML for attribute group.
       *  @listens extension.sfccexplorer.objectattributegroup.getxml */
      case 'extension.sfccexplorer.objectattributegroup.getxml':
        return (metaNode: MetadataNode) => { xmlHandler.getXMLFromNode(metaNode); };

      /** Handles the refresh of the tree view.
       *  @listens extension.sfccexplorer.refresh  */
      case 'extension.sfccexplorer.refresh':
        return () => { metaView.currentProvider.refresh(); };

      /** Handles context menu command to set site value of site preference. 
       *  @listens extension.sfccexplorer.sitepreference.setvalue */
      case 'extension.sfccexplorer.sitepreference.setvalue':
        return (metaNode: MetadataNode) => {
          commandHelper.setPrefValue(metaNode).then(refresh => {
            if (refresh) {
              metaView.currentProvider.refresh();
            }
          });
        };

      /** Handles the add-attribute event for system object definitions.
       *  @listens extension.sfccexplorer.systemobject.addattribute */
      case 'extension.sfccexplorer.systemobject.addattribute':
        return (metaNode: MetadataNode) => {
          ocapiHelper.addAttributeNode(metaNode)
            .then(data => {
              window.showInformationMessage(
                'Attribute successfully added.');
              metaView.currentProvider.refresh();
            })
            .catch(err => {
              window.showErrorMessage('Unable to add attribute: {0}', err);
              console.error(err);
            });
        };

      /** Handles the delete-attribute event for the SFCC system object definitions.
       *  @listens extnesion.sfccexplorer.systemobject.deleteattribute */
      case 'extension.sfccexplorer.systemobject.deleteattribute':
        return (metaNode: MetadataNode) => {
          ocapiHelper
            .deleteAttributeDefinition(metaNode)
            .then(data => {
              window.showInformationMessage('Attribute Deleted Successfully');
              metaView.currentProvider.refresh();
            })
            .catch(err => {
              window.showErrorMessage('Unable to delete attribute: {0}', err);
              console.log(err);
            });
        };

      /** Handles assigning attributes to attribute groups when the VSCode event is triggered.
       *  @listens extension.sfccexplorer.systemobjectattribute.addtogroup */
      case 'extension.sfccexplorer.systemobjectattribute.addtogroup':
        return (metaNode: MetadataNode) => {
          ocapiHelper
            .assignAttributesToGroup(metaNode)
            .then(data => {
              window.showInformationMessage(
                'Attribute successfully added to group.');
              metaView.currentProvider.refresh();
            })
            .catch(err => {
              window.showErrorMessage('Unable to add attribute: {0}', err);
              console.log(err);
            });
        };

      /** Handler method for context menu to get the IMPEX XML for the specified attribute.
       *  @listens extension.sfccexplorer.systemobjectattribute.getxml */
      case 'extension.sfccexplorer.systemobjectattribute.getxml':
        return (metaNode: MetadataNode) => xmlHandler.getXMLFromNode(metaNode);

      /** Handler method for context menu command to remove attribute from a group.
       *  @listens extension.sfccexplorer.systemobjectattribute.removefromgroup */
      case 'extension.sfccexplorer.systemobjectattribute.removefromgroup':
        return (metaNode: MetadataNode) => {
          ocapiHelper
            .removeAttributeFromGroup(metaNode)
            .then(data => {
              window.showInformationMessage('Attribute removed from group successfully.');
              metaView.currentProvider.refresh();
            })
            .catch(err => {
              // If the user canceled the action, then don't show an error.
              if (typeof err.error === 'boolean' && err.error === false) { return; }
              window.showErrorMessage('Could not create attribute group: {0}', err);
              console.log(err);
            });
        };

      /** Handles setting default value for site preference attribute.
       *  @listens extension.sfccexplorer.systemobjectattribute.setdefault */
      case 'extension.sfccexplorer.systemobjectattribute.setdefault':
        return (metaNode: MetadataNode) => {
          ocapiHelper
            .setDefaultAttributeValue(metaNode)
            .then(data => {
              window.showInformationMessage(
                'Attribute default value sucessfully set.');
              metaView.currentProvider.refresh();
            })
            .catch(err => {
              window.showErrorMessage('Unable to set default value: {0}', err);
              console.log(err);
            });
        };

      /** Handles command to get complete system object export XML from SFCC server.
       *  @listens extension.sfccexplorer.systemobjects.getxml */
      case 'extension.sfccexplorer.systemobjects.getxml':
        return (metaNode: MetadataNode) => { xmlHandler.getCompleteXML(metaNode); };

      /** Shows an error message if the command is not yet implemented in code. */
      default:
        return () => {
          window.showErrorMessage('VSCode command callback not found: {0}', commandName);
        };
    }
  }
}