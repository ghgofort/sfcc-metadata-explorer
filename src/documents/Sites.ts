/**
 * Sites.ts
 *
 * Exports a document class for handling the OCAPI Sites Data API document.
 */

import Site from './Site';

/**
 * @class
 * @classdesc - A class for handling the Sites API document for recieving &
 *    sending API calls that require the Sites document.
 */
export default class Sites {
  public count: number = 0;
  public data: Site[] = [];
  public expand: string[] = [];
  public next: string = '';
  public previous: string = '';
  public select: string = '';
  public start: number = 0;
  public total: number = 0;

  /**
   * @param {Object} args - The raw JSON result for the Sites call.
   * @constructor
   */
  constructor(args) {
    if (args) {
      this.count = args.count || 0;
      this.expand = args.expand || [];
      this.next = args.next || '';
      this.previous = args.previous || '';
      this.select = args.select || '';
      this.start = args.start || 0;
      this.total = args.total || 0;

      if (args.data && args.data.length) {
        this.data = args.data.map(siteData => new Site(siteData));
      }
    }
  }
}
