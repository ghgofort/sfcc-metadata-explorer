/**
 * @file SearchRequest.ts
 * @fileoverview - Exports a class for handling Open Commerce API SearchRequest
 * document requests & responses.
 */

import Query from './Query';

/**
 * @class
 * @classdesc - A data model class for working with OCAPI SearchRequest
 * Document types when making queries.
 */
export class SearchRequest {
  /* Member Variables */
  public count: number = 0;
  public db_start_record_: number = 0;
  public expand: string[] = [];
  public query: Query;
  public select: string = '';
  public sorts: Sort[] = [];


  constructor(args) {
    /** @todo */
  }
}
