import ObjectAttributeDefinition from './ObjectAttributeDefinition';

/**
 * @file ObjectAttributeGroup.ts
 * @fileoverview - Exports the ObjectAttributeGroup class which is a model for the OCAPI
 * document representing an attribute group of a system or custom object.
 */

/**
 * @class
 * @classdesc - Used for handling the OCAPI document: ObjectAttributeGroup.
 */
export default class ObjectAttributeGroup {
  // Class Member Fields
  public attributeDefinitions: ObjectAttributeDefinition[] = [];
  public attributeDefinitionsCount: number = 0;
  public description: string = '';
  public displayName: string = '';
  public id: string = '';
  public internal: boolean = false;
  public link: string = '';
  public position: number = 0;

  /**
   * @param {Object} args - The raw JSON object document returned from a call to
   *    SFCC OCAPI.
   * @constructor
   */
  constructor(args) {
    if (args) {
      if (args.attribute_definitions) {
        this.attributeDefinitions = args.attribute_definitions.map(def =>
            new ObjectAttributeDefinition({def}));
      }
      if (args.attribute_definitions_count) {
        this.attributeDefinitionsCount = args.attribute_definitions_count;
      }
      if (args.description && args.description.default) {
        this.description = args.description.default;
      }
      if (args.display_name && args.display_name.default) {
        this.displayName = args.display_name.default;
      }
      if (args.id) {
        this.id = args.id;
      }
      if (args.internal) {
        this.internal = args.internal;
      }
      if (args.link) {
        this.link = args.link;
      }
      if (args.position) {
        this.position = args.position;
      }
    }
  }
}
