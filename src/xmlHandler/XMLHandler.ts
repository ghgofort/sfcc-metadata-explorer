import { MetadataNode } from '../components/MetadataNode';

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
  xmlLib = require('libxmljs');

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
   */
  public getXMLFromNode(metaNode: MetadataNode): Promise<string> {
    // Create the XML document in memory for modification.
    const xml = new this.xmlLib.Document();
    const parentType = metaNode.parentId;

    if (metaNode.nodeType === 'objectAttributeDefinition') {
      const attr = metaNode.objectAttributeDefinition;

      // Create the XML tree.
      xml.node('metadata').namespace(XMLHandler.NAMESPACE_STRING);
      xml.node('type-extension').attr({ 'type-id': parentType });
      xml.node('custom-attribute-definitions');
      xml.node('attribute-definition').attr({ 'attribute-id': attr.id });
      xml.node('display-name', attr.displayName).attr('xml:lang', 'x-default');
      xml.parent().node('description', attr.description)
        .attr('xml:lang', 'x-default');
    }

    return Promise.resolve('');
  }
}