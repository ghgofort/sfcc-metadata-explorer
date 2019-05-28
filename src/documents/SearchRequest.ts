/**
 * @file SearchRequest.ts
 * @fileoverview - Exports a class for handling Open Commerce API SearchRequest
 * document requests & responses.
 */

import Query from './Query';
import Sort from './Sort';

/**
 * @class
 * @classdesc - A data model class for working with OCAPI SearchRequest
 * Document types when making queries.
 */
export class SearchRequest {
  /* Member Variables */
  public count: number = 0;
  public dbStartRecord: number = 0;
  public expand: string[] = [];
  public query: Query;
  public select: string = '';
  public sorts: Sort[] = [];

  /**
   * @constructor
   * @param {Object} [args] - The raw OCAPI document can be passed into the
   *    constructor of the class as the only parameter in order to create an
   *    instance from the supplied OCAPI document.
   * @param {string} [args.count] - The maximum count of result objects
   *    from the request.
   * @param {number} [args.db_start_record] - The record that was used as the
   *    beginning of the results list. This is specifically for paging.string
   * @param {string[]} [args.expand] - An optional expand array that defines
   *    what OCAPI expand parametersshould be included in the request.
   * @param {Query} args.query - The query to determine what results to return.
   * @param {string} args.select - The properties that should be returned by the
   *    query for the matching result objects. Use `(**)` to return all of
   *    the objects properties.
   */
  constructor(args) {
    this.count = args && args.count ? args.count : '';
    this.dbStartRecord = args && args.db_start_record ?
      args.db_start_record : 0;
    this.expand = args && args.expand && Array.isArray(args.expand) ?
      args.expand : [];
    this.query = args && args.query ? new Query(args.query) : null;
    this.select = args && args.select ? args.select : '';

    if (args && args.sorts) {
      this.sorts = args.sorts.map(_sort => new Sort(_sort));
    }
  }
}
