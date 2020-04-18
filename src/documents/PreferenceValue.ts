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
  public siteValues: object = {};
  public valueType: string = '';

  /**
   * @param {object} args - The raw JSON result for the Sites call.
   * @constructor
   */
  constructor(args) {
    if (args) {
      if (args.site_values) {
        this.siteValues = args.site_values;
      }
      if (args.attribute_definition) {
        this.attributeDefinition = new ObjectAttributeDefinition(
          args.attribute_definition);
      }
      if (args.display_name && args.display_name.default) {
        this.displayName = args.display_name;
      }
      if (args.id) {
        this.id = args.id;
      }
      if (args.value_type) {
        this.valueType = args.value_type;
      }
      if (args.description) {
        this.description = args.description;
      }
    }
  }
}
