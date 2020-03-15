/**
 * PreferenceValue.ts
 *
 * Exports a document class for handling the OCAPI PreferenceValue Data API document.
 */

import { IOCAPITypes } from '../interfaces/IOCAPITypes';
import ObjectAttributeDefinition from './ObjectAttributeDefinition';


/**
 * @class
 * @classdesc - A class for handling the Sites API document for recieving &
 *    sending API calls that require the Sites document.
 */
export default class PreferenceValue {
  public id: string = '';
  public description: IOCAPITypes.ILocalizedString = { default: '' };
  public displayName: IOCAPITypes.ILocalizedString = { default: '' };
  public attributeDefinition: ObjectAttributeDefinition;
  public siteValues: Map<string, Object> = new Map();
  public valueType: string = '';

  /**
   * @param {Object} args - The raw JSON result for the Sites call.
   * @constructor
   */
  constructor(args) {
    if (args) {
      if (args.site_values) {
        this.siteValues = args.site_values;
      }
    }
  }
}
