import { apiConfig } from '../apiConfig';
import { OAuth2Token } from '../authorization/OAuth2Token';
import { HTTP_VERB, ICallSetup } from './ICallSetup';

/**
 * @file OCAPIService
 * @fileoverview - Provides a service for making calls to the Open Commerce API
 *    when exposed on a Sales Force Commerce Cloud sandbox instance.
 */

/**
 * @class OCAPIService
 * Proivdes REST request methods for making calls to the SFCC Open Commerce API.
 */
export default class OCAPIService {
  public authToken: OAuth2Token = null;

  /**
   * Returns an object literal that conforms to the ICallSetup interface so that
   * it can be passed directly to the makeCall() method of this class.
   *
   * @param callName - The name of the SFCC OCAPI call to make. The name is
   *    in the format that is used in the URI to identify which asset we are
   *    requesting form the server.
   * @param callData - An object of key/value pairs to be extracted into the
   *    URL parameters, headers, and body of the OCAPI request.
   * @param resourceName - The name of the OCAPI Data API resource to query.
   * @returns An object conforming to the ICallSetup interface with the data
   *    for making the call to the API endpoint, or an appropriate error
   *    message.
   */
  public getCallSetup(
    resourceName: string,
    callName: string,
    callData: object
  ): ICallSetup {
    // Setup default values where appropriate.
    const setupResult: ICallSetup = {
      body: {},
      callName: '',
      endpoint: '',
      headers: {
        contentType: 'application/json'
      },
      method: HTTP_VERB.get,
      setupErrMsg: '',
      setupError: false
    };

    let resConfig;
    let callConfig;

    if (apiConfig.resources.hasOwnProperty(resourceName)) {
      resConfig = apiConfig.resources[resourceName];
      setupResult.endpoint += '/' + resourceName;

      if (
        resConfig.availableCalls &&
        resConfig.availableCalls.hasOwnProperty(callName)
      ) {
        callConfig = resConfig.availableCalls[callName];
      }
    } else {
      setupResult.setupError = true;
      setupResult.setupErrMsg =
        'No setup was found in the apiConfig object for the specified resource';
    }

    return setupResult;
  }

  private getOAuth2Token(tokenType: string) {
    /** @todo: imlement getOAuth2Token() method in OCAPIService class */
  }
}
