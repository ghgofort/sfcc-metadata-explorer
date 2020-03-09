/**
 * Sites.ts
 *
 * Exports a document class for handling the OCAPI Sites Data API document.
 */

/**
 * @class
 * @classdesc - A class for handling the Sites API document for recieving &
 *    sending API calls that require the Sites document.
 */
export default class Sites {
  public count: Number;
  public data: Site[];
  public expand: String[];
  public next: String;
  public previous: String;
  public select: String;
  public start: Number;
  public total: Number;

  /**
   * @param {Object} args - The raw JSON result for the Sites call.
   * @constructor
   */
  constructor(args) {

  }

}
