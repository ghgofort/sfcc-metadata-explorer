/**
 * @file ObjectTypeDefinition.ts
 * @fileoverview - Provides a class for standardized handling of the OCAPI
 * object_type_definitions document type.
 */

import ObjectTypeDefinition from './ObjectTypeDefinition';

/**
 * @class ObjectTypeDefinitions
 * @classdesc - A data model class for working with the OCAPI data API's
 *    object_type_definitions document type.
 */
export class ObjectTypeDefinitions {
  // Declare class member variables.
  public count: number = 0;
  public data: ObjectTypeDefinition[] = [];
  public expand: string[] = [];
  public next: string = '';
  public previous: string = '';
  public select: string = '';
  public start: number = 0;
  public total: number = 0;

  /**
   * @param args - The raw JSON document returned from an OCAPI call.
   * @constructor
   */
  constructor(args) {
    // Get any arguments that were passed into the instance to set the values on
    // Object initialization.
    if (args) {
      if (args.count) {
        this.count = args.count;
      }
      if (args.data) {
        this.data = args.data.map(sod => new ObjectTypeDefinition(sod));
      }
      if (args.expand) {
        this.expand = args.expand;
      }
      if (args.next) {
        this.next = args.next;
      }
      if (args.previous) {
        this.previous = args.previous;
      }
      if (args.select) {
        this.select = args.select;
      }
      if (args.start) {
        this.start = args.start;
      }
      if (args.total) {
        this.total = args.total;
      }
    }
  }
}
