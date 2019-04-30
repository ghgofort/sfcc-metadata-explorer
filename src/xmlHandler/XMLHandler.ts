import { MetadataNode } from '../components/MetadataNode';
import { window, workspace } from 'vscode';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';

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
  public static NAMESPACE_STRING: String =
    'http://www.demandware.com/xml/impex/metadata/2006-10-31';

  /** A list of System Objects that support the site-specific flag on attributes. */
  public static FIELD_ATTRIBUTE_MAP: Object = {
    'order-required-flag': ['Product'],
    'site-specific-flag': [
      'Product', 'Catalog', 'SitePreferences'
    ],
    'visible-flag': ['Product']
  };

  /**
   * @constructor
   */
  constructor() {
    /** @todo: Setup Instance */
  }

  /* ========================================================================
   * Private Helper Functions
   * ======================================================================== */

  private getObjectGroupXML(rootNode: any,
    systemObjectType: string,
    objectAttributeGroup: ObjectAttributeGroup
  ) {
    // Create the XML tree.
    const groupDefinitionsNode = rootNode
      .ele('type-extension', { 'type-id': systemObjectType })
      .ele('group-definitions');

    // Create the group-definition node.
    const groupNode = groupDefinitionsNode.ele('attribute-group', {
      'group-id': objectAttributeGroup.id
    });

    // Add the display-name node.
    groupNode.ele(
      'display-name',
      { 'xml:lang': 'x-default' },
      objectAttributeGroup.displayName
    );

    // Loop through the attributes in the group and create a node for each.
    if (objectAttributeGroup.attributeDefinitions.length) {
      objectAttributeGroup.attributeDefinitions.forEach(attr => {
        groupNode.ele('attribute', { 'attribute-id': attr.id });
      });
    }
  }

  /**
   * Gets the XML node for an ObjectAttributeDefinition class instance.
   *
   * @private
   * @param {Object} rootNode - The root node that can be used for building the
   *    necessary child XML.
   * @param {string} systemObjectType - The system object that the attribute
   *    will be added to.
   * @param {ObjectAttributeDefinition} attribute - The ObjectAttributeDefinition
   *    class instance to derive the XML data from.
   */
  private getObjectAttributeXML(rootNode: any,
    systemObjectType: string,
    attribute: ObjectAttributeDefinition
  ) {
    const valType = attribute.valueType.toLocaleLowerCase();

    // Create the XML tree.
    const attrDefsNode = rootNode
      .ele('type-extension', { 'type-id': systemObjectType })
      .ele('custom-attribute-definitions');

    // Create the attribute definition node.
    const attrDefNode = attrDefsNode.ele('attribute-definition', {
      'attribute-id': attribute.id
    });

    /* ======================================================================
     * Define Attribute Properties - Dependent on Order
     * ====================================================================== */

    attrDefNode.ele(
      'display-name',
      { 'xml:lang': 'x-default' },
      attribute.displayName.default
    );
    attrDefNode.ele(
      'description',
      { 'xml:lang': 'x-default' },
      attribute.description.default
    );
    attrDefNode.ele('type', attribute.valueType);
    attrDefNode.ele('localizable-flag', attribute.localizable);

    if (XMLHandler.FIELD_ATTRIBUTE_MAP['site-specific-flag']
      .indexOf(systemObjectType) > -1
    ) {
      attrDefNode.ele('site-specific-flag',
        attribute.siteSpecific && !attribute.localizable);
    }

    /** @todo: Add the searchable flag to the XML output. */

    attrDefNode.ele('mandatory-flag', attribute.mandatory);

    if (XMLHandler.FIELD_ATTRIBUTE_MAP['visible-flag']
      .indexOf(systemObjectType) > -1
    ) {
      attrDefNode.ele('visible-flag', attribute.visible);
    }

    attrDefNode.ele('externally-managed-flag', attribute.externallyManaged);

    if (XMLHandler.FIELD_ATTRIBUTE_MAP['order-required-flag']
      .indexOf(systemObjectType) > -1
    ) {
      attrDefNode.ele('order-required-flag', attribute.orderRequired);
    }

    attrDefNode.ele('externally-defined-flag', attribute.externallyDefined);



    /**
     * Define properties that are specific to certain value types.
     */
    if (valType.toLowerCase() === 'string') {
      // Set min-length for String attributes.
      attrDefNode.ele({ 'min-length': attribute.minLength });
    } else if (valType.indexOf('enum') > -1 &&
      attribute.valueDefinitions.length
    ) {
      // Add any value-definitions that are configured for the attribute.
      const valDefs = attrDefNode.ele('value-definitions');
      attribute.valueDefinitions.forEach(function (valDef) {
        if (valDef.displayValue && valDef.value) {
          const valDefXML = valDefs.ele('value-definition');
          valDefXML.ele('display',
            { 'xml:lang': 'x-default' },
            valDef.displayValue.default
          );

          valDefXML.ele('value', valDef.value.toString());
        }
      });
    }

    if (typeof attribute.defaultValue !== undefined &&
      attribute.defaultValue.value
    ) {
        attrDefNode.ele('default-value', attribute.defaultValue.value);
    }
  }
s
  /* ========================================================================
   * Public Exported Methods
   * ======================================================================== */

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
    const systemObjectType = metaNode.parentId.split('.').pop();

    // Create the XML document in memory for modification.
    const rootNode = new this.xmlLib.create('metadata', {
      encoding: 'utf-8'
    }).att('xmlns', XMLHandler.NAMESPACE_STRING);

    if (metaNode.nodeType === 'objectAttributeDefinition') {
      const attribute = metaNode.objectAttributeDefinition;
      this.getObjectAttributeXML(rootNode, systemObjectType, attribute);
    } else if (metaNode.nodeType === 'objectAttributeGroup') {
      this.getObjectGroupXML(rootNode, systemObjectType,
        metaNode.objectAttributeGroup);
    }

    // Create the text document and show in the editor.
    workspace
      .openTextDocument({
        language: 'xml',
        content: rootNode.end({ allowEmpty: false, pretty: true })
      })
      .then(doc => {
        window.showTextDocument(doc);
      });
  }
}
