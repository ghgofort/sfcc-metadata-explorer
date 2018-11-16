
/**
 * @file OCAPIHelper.ts
 * @fileoverview - Exports a single clsass for modeling the system object
 * attribute definitions, and interacting with the OCAPI service to add, modify,
 * and delete attribute definitions.
 */

import { ICallSetup } from '../service/ICallSetup';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import { OCAPIService } from '../service/OCAPIService';

/**
 * A class with static helper methods for assisting in making calls to the SFCC
 * Open Commerce API in order to read from and write too the system object
 * definitions used by the SFCC instance.
 */
export default class SystemObjectAttributeHelper {
  public static async addSystemObjectAttribute(attributeName: string): Promise<ObjectAttributeDefinition> {
    const service: OCAPIService = new OCAPIService();
    let _callSetup: ICallSetup = null;
    let _callResult: any;

    try {
      _callSetup = await OCAPIService.getCallSetup('SystemObjectAttribute', 'add', {});
    } catch (e) {

    }

    const result = new ObjectAttributeDefinition({});

    return Promise.resolve(result);
  }
}