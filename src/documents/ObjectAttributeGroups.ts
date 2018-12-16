/**
 * @file ObjectAttributeGroups.ts
 * @fileoverview - Exports a single class for working with system object
 *    attribute groups with OCAPI.
 */

import ObjectAttributeGroup from './ObjectAttributeGroup';

/**
 * @class ObjectAttributeGroups
 * @classdesc - Represents a list of returned attribute groups from a call to
 *    the API endpoint to retrieve the system object attribute groups of a SFCC
 *    system object.
 */
export default class ObjectAttributeGroups {
  // Class Member Fields
  public count: number = 0;
  public data: ObjectAttributeGroup[] = [];
  public expand: string[] = [];
  public next: string = '';
  public previous: string = '';
  public select: string = '';
  public start: number = 0;
  public total: number = 0;

  /**
   * @param {Object} [args] - Raw JSON response from OCAPI call.
   * @constructor
   */
  constructor(args) {
    if (args) {
      if (args.count) {
        this.count = args.count;
      }
      if (args.data) {
        this.data = args.data.map(group => new ObjectAttributeGroup(group));
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
