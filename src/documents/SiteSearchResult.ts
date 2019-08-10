/**
 * @file SiteSearchResult.ts
 * @fileoverview - Exports a data class representing an OCAPI Data API document
 *    of type `SiteSearchResult`.
 */

import Query from './Query';
import ResultPage from './ResultPage';
import Sort from './Sort';

export default class SiteSearchResult {
  /* Member Variables */
  public count: number = 0;
  public dbStartRecord: number = 0;
  public expand: string[] = [];
  public query: Query;
  public select: string = '';
  public sorts: Sort[] = [];
  public hits: any[] = [];
  public start: number = 0;
  public total: number = 0;
  public next: ResultPage = null;
  public previous: ResultPage = null;

  constructor(args) {
    this.count = args && args.count ? args.count : 0;
  }
}
