/**
 * @file ObjectAttributeDefinition.ts
 * @fileoverview - Exports the ObjectAttributeDefinition class which is a model
 * for the OCAPI document representing an attribute definition of a system or
 * custom object.
 */

import { IOCAPITypes } from '../interfaces/IOCAPITypes';
import ObjectAttributeValueDefinition from './ObjectAttributeValueDefinition';

/**
 * @class - Used for handling the OCAPI document: ObjectAttributeDefinition.
 * @param {Object} args - The raw JSON object document returned from a call to
 *      SFCC OCAPI.
 */
export default class ObjectAttributeDefinition {
  // Declare public class members.
  public defaultValue: ObjectAttributeValueDefinition;
  public description: IOCAPITypes.ILocalizedString;
  public displayName: IOCAPITypes.ILocalizedString;
  public effectiveId: string;
  public externallyDefined: boolean;
  public externallyManaged: boolean;
  public fieldHeight: number;
  public fieldWidth: number;
  public id: string;
  public key: boolean;
  public link: string;
  public localizable: boolean;
  public mandatory: boolean;
  public maxValue?: number;
  public minLength: number;
  public minValue?: number;
  public multiValueType: boolean;
  public orderRequired: boolean;
  public queryable: boolean;
  public readOnly: boolean;
  public regularExpression: string;
  public requiresEncoding: boolean;
  public scale: number;
  public searchable: boolean;
  public setValueType: boolean;
  public siteSpecific: boolean;
  public system: boolean;
  public unit: IOCAPITypes.ILocalizedString;
  public valueDefinitions: ObjectAttributeValueDefinition[];
  public valueType: string;
  public visible: boolean;

  // members that need to be renamed when sending the doc.
  private readonly MEMBER_MAP = {
    displayName: 'display_name',
    effectiveId: 'effective_id',
    externallyDefined: 'externally_defined',
    externallyManaged: 'externally_managed',
    fieldHeight: 'field_height',
    fieldWidth: 'field_width',
    maxValue: 'max_value',
    minLength: 'min_length',
    minValue: 'min_value',
    multiValueType: 'multi_value_type',
    orderRequired: 'order_required',
    readOnly: 'read_only',
    regularExpression: 'regular_expression',
    requiresEncoding: 'requires_encoding',
    setValueType: 'set_value_type',
    siteSpecific: 'site_specific',
    valueDefinitions: 'value_definitions',
    valueType: 'value_type'
  };

  /**
   * @constructor
   * @param {Object} args - The raw JSON response object:
   *    object_attribute_value_definition.
   *
   * Notes:
   *  - Number values that default to -1 do so because they are integers. The -1
   *    value indicates that they have not been set.
   *  - The values for field_height and field_width are ignored only kept for
   *    use in the import and export files.
   */
  constructor(args) {
    this.defaultValue =
      new ObjectAttributeValueDefinition(args.default_value) ||
      new ObjectAttributeValueDefinition({});
    this.description = args.description || { default: '' };
    this.displayName = args.display_name || { default: '' };
    this.effectiveId = args.effective_id || '';
    this.externallyDefined = args.externally_defined || false;
    this.externallyManaged = args.externally_managed || false;
    this.fieldHeight = args.field_height || -1;
    this.fieldWidth = args.field_width || -1;
    this.id = args.id || '';
    this.key = args.key || false;
    this.link = args.link || '';
    this.localizable = args.localizable || false;
    this.mandatory = args.mandatory || false;
    this.maxValue = args.max_value || null;
    this.minLength = args.min_length || -1;
    this.minValue = args.min_value || null;
    this.multiValueType = args.multi_value_type || false;
    this.orderRequired = args.order_required || false;
    this.queryable = args.queryable || false;
    this.readOnly = args.read_only || false;
    this.regularExpression = args.regular_expression || '';
    this.requiresEncoding = args.requires_encoding || false;
    this.scale = args.scale || -1;
    this.searchable = args.searchable || false;
    this.setValueType = args.set_value_type || '';
    this.siteSpecific = args.site_specific || false;
    this.system = args.system || false;
    this.unit = args.unit || { default: '' };
    this.valueDefinitions = args.value_definitions || [];
    this.valueType = args.value_type || '';
    this.visible = args.visible || false;
  }

  public toJson(): string {
    const mmNames = Object.keys(this.MEMBER_MAP);
    const sendDoc = [
      'defaultValue',
      'description',
      'displayName',
      'effectiveId',
      'externallyDefined',
      'externallyManaged',
      'fieldHeight',
      'fieldWidth',
      'id',
      'key',
      'link',
      'localizable',
      'mandatory',
      'maxValue',
      'minLength',
      'minValue',
      'multiValueType',
      'orderRequired',
      'queryable',
      'readOnly',
      'regularExpression',
      'requiresEncoding',
      'scale',
      'searchable',
      'setValueType',
      'siteSpecific',
      'system',
      'unit',
      'valueDefinitions',
      'valueType',
      'visible'
    ].map(localPropName => {
      if (mmNames.indexOf(localPropName) > -1) {
        // If the mapped name exists, then re-map for JSON object.
        return {
          key: this.MEMBER_MAP[localPropName],
          value: this[localPropName]
        };
      }

      // If the name doesn't exist in the map then use the local name.
      return {
        key: localPropName,
        value: this[localPropName]
      };
    });


    return JSON.stringify(sendDoc);
  }
}
