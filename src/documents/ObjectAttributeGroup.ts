/**
 * @file ObjectAttributeGroup.ts
 * @fileoverview - Exports the ObjectAttributeGroup class which is a model for the OCAPI
 * document representing an attribute group of a system or custom object.
 */

import { getAPIVersion } from '../apiConfig';
import IAPIDocument from '../interfaces/IAPIDocument';
import ObjectAttributeDefinition from './ObjectAttributeDefinition';

/**
 * @class
 * @classdesc - Used for handling the OCAPI document: ObjectAttributeGroup.
 */
export default class ObjectAttributeGroup implements IAPIDocument {
  // Class Member Fields
  public attributeDefinitions: ObjectAttributeDefinition[] = [];
  public attributeDefinitionsCount: number = 0;
  public description: string = '';
  public displayName: string = '';
  public id: string = '';
  public internal: boolean = false;
  public link: string = '';
  public position: number = 0;
  public includedFields: string[] = [];

  public readonly MEMBER_MAP = {
    attributeDefinitions: 'attribute_definitions',
    attributeDefinitionsCount: 'attribute_definitions_count',
    displayName: 'display_name'
  };

  /**
   * @param {Object} args - The raw JSON object document returned from a call to
   *    SFCC OCAPI.
   * @constructor
   */
  constructor(args) {
    if (args) {
      if (args.attribute_definitions) {
        this.attributeDefinitions = args.attribute_definitions.map(def =>
            new ObjectAttributeDefinition(def));
      }
      if (args.attribute_definitions_count) {
        this.attributeDefinitionsCount = args.attribute_definitions_count;
      }
      if (args.description && args.description.default) {
        this.description = args.description.default;
      }
      if (args.display_name && args.display_name.default) {
        this.displayName = args.display_name.default;
      }
      if (args.id) {
        this.id = args.id;
      }
      if (args.internal) {
        this.internal = args.internal;
      }
      if (args.link) {
        this.link = args.link;
      }
      if (args.position) {
        this.position = args.position;
      }
    }
  }

  public getDocument(includeFields: string[] = []): object {
    const documentObj = {};
    let memberNames = Object.keys(this).filter(
      key =>
        typeof key !== 'function' &&
        key !== 'MEMBER_MAP' &&
        key !== 'includedFields'
    );

    // If the fields to return were specified, then filter the array of
    // properties to assign to the new object literal.
    if (includeFields && includeFields.length) {
      memberNames = memberNames.filter(
        name => includeFields.indexOf(name) > -1
      );
    } else if (this.includedFields.length) {
      memberNames = memberNames.filter(
        name => this.includedFields.indexOf(name) > -1
      );
    }

    // Create a property on the results object.
    memberNames.forEach(localPropName => {
      const docPropName: string = localPropName in this.MEMBER_MAP ?
        this.MEMBER_MAP[localPropName] : localPropName;
      let localPropVal: any;

      if (typeof this[localPropName] !== 'undefined') {
        localPropVal = this[localPropName];
        const isComplexType =
          typeof localPropVal !== 'number' &&
          typeof localPropVal !== 'string' &&
          typeof localPropVal !== 'boolean';

        if (!isComplexType) {
          documentObj[docPropName] = localPropVal;
        } else {
          if (localPropVal instanceof ObjectAttributeDefinition) {
            // ==> ObjectAttributeValueDefinition - this.defaultValue
            documentObj[docPropName] = localPropVal.getDocument();
          } else {
            // ==> ILocalizedString - this.description & this.displayName
            documentObj[docPropName] = localPropVal;
          }
        }
      }
    });

    // tslint:disable-next-line: no-string-literal
    documentObj['_v'] = getAPIVersion();

    return documentObj;
  }
}
