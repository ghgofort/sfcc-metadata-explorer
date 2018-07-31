/**
 * @file ObjectTypeDefinition.ts
 * @fileoverview - Provides a class for standardized handling of the OCAPI
 * object_type_definition document type.
 */

/**
 * @class ObjectTypeDefinition
 */
export default class ObjectTypeDefinition {
  attributeDefinitionCount: number = 0;
  attributeGroupCount: number = 0;
  contentObject: boolean = false;
  description: string = '';
  displayName: string = '';
  link: string = '';
  objectType: string = '';
  queryable: boolean = true;
  readOnly: boolean = false;

  /**
   * @constructor
   * @param {object} [args] - A system_object_definition document returned from
   *    a call to the Open Commerce API.
   * @param {number} [args.attribute_definition_count] - The number of attribute
   *    definitions contained by the type. This is a computed attribute and
   *    cannot be changed.
   * @param {number} [args.attribute_group_count] - The number of attribute
   *    groups contained by the type. This is a computed attribute and cannot be
   *    changed.
   * @param {boolean} [args.content_object] - True if the object type definition
   *    is marked as a content object
   * @param {string} [args.description] - The user entered description for the
   *    type (localizable)
   * @param {string} [args.display_name] - The user entered display name
   *    (localizable).
   * @param {string} [args.link] - URL that is used to get this instance. This
   *    is a computed attribute and cannot be changed.
   * @param {string} [args.object_type] - The object type identifier.
   * @param {boolean} [args.queryable] - True if the system object type is
   *    queryable, false otherwise. Default is true.
   * @param {boolean} [args.read_only] - True if the system object is read-only,
   *    false otherwise. This is a computed attribute and cannot be changed.
   */
  constructor(args) {
    // Get any passed in property values and assign them to the class instance.
    if (args) {
      if (args.attribute_definition_count) {
        this.attributeDefinitionCount = args.attribute_definition_count;
      }
      if (args.attribute_group_count) {
        this.attributeGroupCount = args.attribute_group_count;
      }
      if (args.content_object) { this.contentObject = args.content_object }
      if (args.description) { this.description = args.description }
      if (args.display_name) { this.displayName = args.display_name }
      if (args.link) { this.link = args.link }
      if (args.object_type) { this.objectType = args.object_type }
      if (args.queryable) { this.queryable = args.queryable }
      if (args.read_only) { this.readOnly = args.read_only }
    }
  }
}
