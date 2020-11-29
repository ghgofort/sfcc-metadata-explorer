/**
 * @file ObjectAttributeValueDefinition.ts
 * @fileoverview - Exports a single data-model class that takes an OCAPI
 * ObectAttributeValueDefinition document result in the constructor and provides
 * a class with cammel-case named variables for use in the data provider class.
 */

import { IOCAPITypes } from '../interfaces/IOCAPITypes';

interface IValDefinitionArgs {
  description: IOCAPITypes.ILocalizedString;
  display_value: IOCAPITypes.ILocalizedString;
  id: string;
  position: number;
  value: Object;
}

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
  public value: any;
  [index: string]: string|IOCAPITypes.ILocalizedString|number;

  /**
   * A constructor function for initializing new instances of the class.
   * @param {IValDefinitionArgs} [args] - The raw JSON document object returned from a call
   *    to the Open Commerce API of type object_attribute_value_definition.
   * @constructor
   */
  constructor(args: IValDefinitionArgs) {
    this.description = args && args.description ? args.description : { default: '' };
    this.displayValue = args.display_value || { default: '' };
    this.id = args.id || '';
    this.position = args.position || -1;
    if (args.value == false) {
      this.value = args.value;
    } else {
      this.value = args.value || {};
    }
  }

  /**
   * Gets a JSON string representation in the form of the OCAPI document.
   *
   * @param {string[]} [includeFields = []] - An optional argument to specify which
   *    class properties to include in the JSON string result. If empty, all of
   *    the class properties will be included. This is not ideal when updating
   *    because it will overwrite values for attribute properties that were
   *    previously set with the class defaults. In this case, specify only the
   *    fields that you are updating.
   * @return {Object} - Returns a JSON object representation of the OCAPI
   *    document class that can be submitted to the API methods.
   */
  public getDocument(includeFields: string[] = []): object {
    const result = {};
    return result;
  }
}
