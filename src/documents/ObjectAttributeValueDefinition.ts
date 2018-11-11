/**
 * @file ObjectAttributeValueDefinition.ts
 * @fileoverview - Exports a single data-model class that takes an OCAPI
 * ObectAttributeValueDefinition document result in the constructor and provides
 * a class with cammel-case named variables for use in the data provider class.
 */

import { IOCAPITypes } from '../interfaces/IOCAPITypes';

/**
 * @class ObjectAttributeValueDefinition
 * @classdesc - A data class for the OCAPI data API document type:
 *    - ObjectAttributeValueDefinition
 */
export default class ObjectAttributeValueDefinition {
  // Declare class member variables.
  public description: IOCAPITypes.ILocalizedString;
  public displayValue: IOCAPITypes.ILocalizedString;
  public id: string;
  public position: number;
  public value: Object;

  /**
   * A constructor function for initializing new instances of the class.
   * @param {Object} [args] - The raw JSON document object returned from a call
   *    to the Open Commerce API of type object_attribute_value_definition.
   * @constructor
   */
  constructor(args) {
    if (args) {
      this.description = args.description || { default: '' };
      this.displayValue = args.display_value || { default: '' };
      this.id = args.id || '';
      this.position = args.position || -1;
      this.value = args.value || {};
    }
  }
}
