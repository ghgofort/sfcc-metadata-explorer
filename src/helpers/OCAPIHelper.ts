import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';

/**
 * @file OCAPIHelper.ts
 * @fileoverview - Exports a single clsass for modeling the system object
 * attribute definitions, and interacting with the OCAPI service to add, modify,
 * and delete attribute definitions.
 */

export default class SystemObjectAttributeHelper {

  /**
   * @param {Object} args - An arguments object.
   * @constructor
   */
  constructor(args) {
    /** @todo */
  }

  public async addSystemObjectAttribute(attributeName: string): Promise<ObjectAttributeDefinition> {
    const result = new ObjectAttributeDefinition({});
    return Promise.resolve(result);
  }
}