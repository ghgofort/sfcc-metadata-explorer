import { MetadataNode } from '../components/MetadataNode';
import { commands, window, workspace, Uri, TextDocument, TextEditor } from 'vscode';

/**
 * @file XMLHandler.ts
 * @fileoverview - Exports a class that can be used for handling XML and
 *    building and parsing XML strings for generating SFCC schema XML.
 */

/**
 * @class XMLHandler
 * @classdesc - The XMLHandler class can be instantiated for generating XML
 *    from SFCC system object & attribute definitions.
 */
export default class XMLHandler {
  /* Class imports */
  xmlLib = require('xmlbuilder');

  /* Instance members */
  public static NAMESPACE_STRING: String = 'http://www.demandware.com/xml/impex/metadata/2006-10-31';

  /**
   * @constructor
   */
  constructor() {
    /** @todo: Setup Instance */
  }

  /**
   * Gets the XML representation of the Metanode, creates a blank file, and
   * populates the file with the generated XML.
   *
   * @param {MetadataNode} metaNode - The metadata node that represents the SFCC
   *    meta object to get the XML representation of.
   * @returns {Promise<TextEditor>} - Returns a promise that resolves to the
   *    TextDocument instance.
   */
  public async getXMLFromNode(metaNode: MetadataNode) {
    // Create the XML document in memory for modification.
    const rootNode = new this.xmlLib.create('metadata', { 'xmlns': XMLHandler.NAMESPACE_STRING });
    const parentType = metaNode.parentId.split('.').pop();

    if (metaNode.nodeType === 'objectAttributeDefinition') {
      const attr = metaNode.objectAttributeDefinition;

      // Create the XML tree.
      const attrDefsNode = rootNode
        .ele('type-extension', { 'type-id': parentType })
        .ele('custom-attribute-definitions');

      // Create the attribute definition node.
      const attrDefNode = attrDefsNode.ele(
        'attribute-definition', { 'attribute-id': attr.id });

      // Define the attribute properties.
      attrDefNode.ele('display-name', {'xml:lang': 'x-default'}, attr.displayName.default);
      attrDefNode.ele('description', {'xml:lang': 'x-default'}, attr.description.default);
      attrDefNode.ele('type', attr.valueType);
      attrDefNode.ele('mandatory-flag', attr.mandatory);
      attrDefNode.ele('externally-managed-flag', attr.externallyManaged);

      // Define properties that are specific to certain data types.
      if (attr.valueType === 'string') {
        attrDefNode.ele({ 'min-length': attr.minLength });
      }
    }

    // Create the text document and show in the editor.
    workspace.openTextDocument({
      'language': 'xml',
      'content': rootNode.end({ allowEmpty: false })
    }).then((doc) => {
      window.showTextDocument(doc);
    });
  }
}