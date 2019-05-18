/**
 * @file Query.ts
 * @fileoverview - Exports a single OCAPI document class for a Query.
 */

import { IOCAPITypes } from '../interfaces/IOCAPITypes';

/**
 * @class Query
 * @classdesc - A document class for the OCAPI data API document: Query.
 */
export default class Query {
  // Class members
  public boolQuery?: IOCAPITypes.IBoolQuery;
  public fileteredQuery?: IOCAPITypes.IFilteredQuery;
  public matchAllQuery?: IOCAPITypes.IMatchAllQuery;
  public termQuery?: IOCAPITypes.ITermQuery;
  public textQuery?: IOCAPITypes.ITextQuery;

  /**
   * @constructor
   * @param {IOCAPITypes.IQueryParams} [query] - An arguments object that
   *  contains one of the defined query types (optional).
   */
  constructor(query?: IOCAPITypes.IQueryParams) {
    if (query) {
      if (query.boolean_query) {
        this.boolQuery = query.boolean_query;
      }
      if (query.filtered_query) {
        this.fileteredQuery = query.filtered_query;
      }
      if (query.match_all_query) {
        this.matchAllQuery = query.match_all_query;
      }
      if (query.term_query) {
        this.termQuery = query.term_query;
      }
      if (query.text_query) {
        this.textQuery = query.text_query;
      }
    }
  }
}
