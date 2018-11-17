/**
 * @file OCAPIHelper.ts
 * @fileoverview - Exports a single clsass for modeling the system object
 * attribute definitions, and interacting with the OCAPI service to add, modify,
 * and delete attribute definitions.
 */

import { ICallSetup } from '../service/ICallSetup';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import { OCAPIService } from '../service/OCAPIService';
import { MetadataView } from '../components/MetadataView';
import { window, CancellationTokenSource, CancellationToken } from 'vscode';

/**
 * @class OCAPIHelper
 * @classdesc - A class with static helper methods for assisting in making calls
 * to the SFCC Open Commerce API in order to read from and write too the system
 * object definitions used by the SFCC instance.
 */
export default class OCAPIHelper {
  /* ========================================================================
   * Static Instance Methods
   * ======================================================================== */

   /**
   * Makes a call to the OCAPIService class to add a new system object attribute
   * definition to the system object who's Id is specified.
   *
   * @param {string} systemObjectId - The Id of the system object to that the
   *    new attribute definition should be added to.
   * @param {ObjectAttributeDefinition} attributeDefinition - The object
   *    attribute defintion class instance that can be passed to the OCAPI
   *    service as the body of the request.
   * @returns {Promise<Object>} - Returns a promise that resoves to an Object.
   *    The object is the JSON result reutrned form the service call.
   */
  public static async addAttributeDefiniton(
    systemObjectId: string,
    attributeDefinition: ObjectAttributeDefinition
  ): Promise<any> {
    const service: OCAPIService = new OCAPIService();
    let _callSetup: ICallSetup = null;
    let _callResult: any;

    try {
      _callSetup = await service.getCallSetup(
        'systemObjectDefinitions',
        'addAttribute',
        attributeDefinition
      );

      _callResult = await service.makeCall(_callSetup);
    } catch (e) {
      console.log(e);
    }

    return Promise.resolve(_callResult);
  }

  /**
   * Uses a 'wizard' like approach to get the needed information for creating a
   * new system object attribute definition.
   *  - Input boxes are displayed, one-by-one, to get the attribute definition
   *    properties.
   *  - A new node is added to the tree view representing the attribute values
   *    that have been entered.
   *  - An indicator is added to show that the attribute is still being
   *    processed while the request is made to the OCAPI service.
   *  - A request is made to the OCAPI endpoint to create the system object
   *    attribute definition, and the indicator is removed from the tree node.
   *
   * @param {MetadataView} metadataView - The view instance that was created
   *    when the extension was loaded. This is used to add interact with the
   *    views.
   */
  public static async addAttributeNode(
    metadataView: MetadataView
  ): Promise<any> {
    // Create a cancelation token instance to cancel the request when needed.
    const cancelAddAttributeToken: CancellationToken =
      new CancellationTokenSource().token;

    // Show an input box for the user to enter the Id for the new attribute.
    window.showInputBox({}, cancelAddAttributeToken);

    return Promise.reject('This method is not implemented');
  }
}
