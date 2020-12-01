/**
 * @file OCAPIService
 * @fileoverview - Provides a service for making calls to the Open Commerce API
 *    when exposed on a Sales Force Commerce Cloud sandbox instance.
 */

import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import { window } from 'vscode';
import { apiConfig, getAPIVersionForPath, getClientId, getClientPass } from '../apiConfig';
import { OAuth2Token } from '../authorization/OAuth2Token';
import { HTTP_VERB, ICallSetup } from './ICallSetup';
import { IDWConfig } from './IDWConfig';
import ConfigHelper from '../helpers/ConfigHelper';

/**
 * @class OCAPIService
 * Proivdes REST request methods for making calls to the SFCC Open Commerce API.
 */
export class OCAPIService {
  public authToken: OAuth2Token = new OAuth2Token();
  private ConfigHelper = new ConfigHelper();
  private isGettingToken: boolean = false;
  private dwConfig: IDWConfig = {
    hostname: '',
    ok: false,
    password: '',
    username: ''
  };

  /**
   * Returns an object literal that conforms to the ICallSetup interface so that
   * it can be passed directly to the makeCall() method of this class.
   * @public
   * @param {string} resourceName - The name of the OCAPI Data API resource to query.
   * @param {string} callName - The name of the SFCC OCAPI call to make. The name is
   *    in the format that is used in the URI to identify which asset we are
   *    requesting form the server.
   * @param {Object} [callData] - An object of key/value pairs to be extracted into the
   *    URL parameters, headers, and body of the OCAPI request.
   * @returns An object conforming to the ICallSetup interface with the data
   *    for making the call to the API endpoint, or an appropriate error
   *    message.
   */
  public async getCallSetup(
    resourceName: string,
    callName: string,
    callData?: any
  ): Promise<ICallSetup> {
    // Setup default values where appropriate.
    const setupResult: ICallSetup = {
      body: {},
      callName: '',
      endpoint: '',
      headers: {
        'Content-Type': 'application/json'
      },
      method: HTTP_VERB.get,
      setupErrMsg: '',
      setupError: false
    };

    let resConfig;
    let callConfig;

    // Check that calls to the specified resource have been configured in the
    // apiConig.ts configuration file.
    if (apiConfig.resources.hasOwnProperty(resourceName)) {
      resConfig = apiConfig.resources[resourceName];
    } else {
      setupResult.setupError = true;
      setupResult.setupErrMsg +=
        '\nNo setup found in apiConfig for resource: ' + resourceName;
    }

    // If an API is specified, then append it to the endpoint.
    if (resConfig && resConfig.api) {
      setupResult.endpoint += '/s/-/dw/' + resConfig.api + '/';
    } else {
      setupResult.setupError = true;
      setupResult.setupErrMsg +=
        '\nNo API was specified in the apiConfig object';
    }

    // Add the configured version to the path.
    setupResult.endpoint += getAPIVersionForPath() + '/';

    // Check if the call name is configured for the specified resource.
    if (resConfig &&
      resConfig.availableCalls &&
      resConfig.availableCalls.hasOwnProperty(callName)
    ) {
      setupResult.callName = callName;
      callConfig = resConfig.availableCalls[callName];
    } else {
      setupResult.setupError = true;
      setupResult.setupErrMsg +=
        '\nNo matching method call found for: ' +
        callName +
        '\nResource: ' +
        resourceName;
    }

    // Add the path to the endpoint.
    if (callConfig && callConfig.path) {
      setupResult.endpoint += callConfig.path;
    } else {
      setupResult.setupError = true;
      setupResult.setupErrMsg += '\nMissing call path in the apiConfig:';
      setupResult.setupErrMsg += '\n- OCAPI resource: ' + resourceName;
      setupResult.setupErrMsg += '\n- Call type: ' + callName;
    }

    // If headers are specified, then replace the default with the specified.
    if (callConfig && callConfig.headers) {
      setupResult.headers = callConfig.headers;
    }

    if (callConfig && callConfig.method) {
      setupResult.method = callConfig.method;
    }

    // Check that any required parameters are included in the callData.
    if (callConfig && callConfig.params && callConfig.params.length) {
      const usedParams: string[] = [];

      // If an explicit body was included, then append it to the seutp object.
      if ('body' in callData) {
        if (typeof callData.body === 'string') {
          setupResult.body = encodeURIComponent(setupResult.body);
        }
        setupResult.body = callData.body;
        usedParams.push('body');
      }

      callConfig.params.forEach((param: any) => {
        const replaceMe = '{' + param.id + '}';
        if (
          callData[param.id] &&
          typeof callData[param.id] === param.type &&
          typeof param.use === 'string' &&
          usedParams.indexOf(param.id) === -1
        ) {
          // Determine where the parameter needs to be included in the
          // call and add it to the call setup object.
          if (
            param.use === 'PATH_PARAMETER' &&
            setupResult.endpoint.indexOf(replaceMe) > -1
          ) {
            setupResult.endpoint = setupResult.endpoint.replace(
              replaceMe,
              callData[param.id]
            );
          } else if (param.use === 'QUERY_PARAMETER') {
            // Check if this is the first query string parameter, or an
            // additional parameter being added to the list.
            setupResult.endpoint +=
              setupResult.endpoint.indexOf('?') > -1 ? '&' : '?';
            // Append to the URL as a query string type parameter.
            setupResult.endpoint +=
              encodeURIComponent(param.id) +
              '=' +
              encodeURIComponent(callData[param.id]);
          } else {
            // If the request supports a call body, then any parameter data
            // that is not specified as a parameter in the config will be
            // added to the body of the request.
            setupResult.body[param.id] = callData[param.id];
          }

          // Mark this parameter as used.
          usedParams.push(param.id);
        } else {
          setupResult.setupError = true;
          setupResult.setupErrMsg += '\nMissing call parameter: ' + param;
          setupResult.setupErrMsg += '\n- Resource: ' + resourceName;
          setupResult.setupErrMsg += '\n- Call type: ' + callName;
        }
      });

      // Remove any already added data properties.
      const dataKeys = Object.keys(callData).filter(k =>
          usedParams.indexOf(k) === -1);

      if (dataKeys.length) {
        // Loop through any keys that are not in the API config and add them to
        // the request in either the URI or the Body of the request, based on the
        // HTTP method used.
        dataKeys.forEach((optionalParam) => {
          // Add any remaining parameters to the request.
          if (setupResult.method === HTTP_VERB.get) {
            setupResult.endpoint +=
            setupResult.endpoint.indexOf('?') > -1 ? '&' : '?';
            setupResult.endpoint +=
              encodeURIComponent(optionalParam) +
              '=' +
              encodeURIComponent(callData[optionalParam]);
          } else {
            setupResult.body[optionalParam] = callData[optionalParam];
          }
        });
      }
    }

    // If the call setup was complete, then get the sandbox configuration.
    if (!setupResult.setupError) {
      // Get the sandbox configuration.
      this.dwConfig = await this.ConfigHelper.getDWConfig();
      if (!this.dwConfig.ok) {
        setupResult.setupError = true;
      } else {
        // Concatenate the sandbox URL with the call endpoint to get the
        // complete endpoint URI.
        setupResult.endpoint =
          'https://' + this.dwConfig.hostname + setupResult.endpoint;

        // Check if there needs to be an OAuth2 token included with the request.
        if (callConfig && typeof callConfig.authorization === 'string') {
          const token = await this.getOAuth2Token(callConfig.authorization);
          setupResult.headers.Authorization =
            token.tokenType + ' ' + token.accessToken;
        }
      }
    } else {
      console.error('ERROR in setupResult', setupResult);
    }

    return setupResult;
  }

  /**
   * Gets an OAuth 2.0 token wich is then included in the authorization header
   * for subsequent calls to the OCAPI Shop or Data APIs. The grant is requested
   * from either the Digital Application Server for a BM user grant type, or
   * from the Digital Authorization Server for a client credentials grant type.
   *
   * @param {string} tokenType - The type of token that is needed for the API
   *    call to be made. This should either be 'BM_USER' for a Business Manager
   *    User type of token, or 'CLIENT_CREDENTIALS' for a Client Credentials
   *    type of token. See the OCAPI documentation for more information about
   *    token types.
   */
  public async getOAuth2Token(tokenType: string): Promise<OAuth2Token> {
    // Get the sandbox configuration.
    this.dwConfig = await this.ConfigHelper.getDWConfig();
    if (!this.dwConfig.ok) {
      console.error('DW config is no bueno...');
      return Promise.reject(
        'There was an error parsing the dw.json config file'
      );
    } else if (
      tokenType === 'BM_USER' &&
      apiConfig.hasOwnProperty('clientId')
    ) {
      this.isGettingToken = true;

      // Concatenate the pieces of the URL.
      const url =
        'https://' +
        this.dwConfig.hostname +
        '/dw/oauth2/access_token?client_id=' +
        getClientId();

      // Encode credentials to base64
      const encodedString = Buffer.from(
        this.dwConfig.username +
          ':' +
          this.dwConfig.password +
          ':' +
          getClientPass()
      ).toString('base64');
      const authString = 'Basic ' + encodedString;
      const bodyParams = new URLSearchParams();
      bodyParams.append(
        'grant_type',
        'urn:demandware:params:oauth:grant-type:client-id:dwsid:dwsecuretoken'
      );

      const result: Promise<OAuth2Token> = new Promise((resolve, reject) => {
        fetch(url, {
          body: bodyParams,
          headers: {
            Authorization: authString,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'POST'
        })
          .then(resp => {
            if (resp.ok) {
              return resp.json();
            } else {
              reject(
                'Could not retrieve Auth Token from Digital Application Server'
              );
            }
          })
          .then(resp => {
            this.authToken = new OAuth2Token(resp);
            resolve(this.authToken);
          })
          .catch(e => {
            reject(e);
          });
      });

      return result;
    } else if (tokenType === 'CLIENT_CREDENTIALS') {
      /** @todo: implement getOAuth2Token for auth server authentication */
      return Promise.reject('Operation Not Yet Implemented.');
    }
    return Promise.reject('There Was a Service Error.');
  }

  /**
   * Makes a call to the SFCC Open Commerce API using node-fetch.
   * @param {ICallSetup} callSetup - The OCAPI call setup object that implements
   *    the interface ICallSetup.
   * @return {Promise<any>} - Returns a promise that resolves to the returned &
   *    formatted data from the API call or an error message if there was an
   *    exception durring the execution of the API call.
   */
  public async makeCall(callSetup: ICallSetup): Promise<any> {
    let params;
    if (callSetup.body && Object.keys(callSetup.body).length > 0) {
      params = {
        headers: callSetup.headers,
        method: callSetup.method,
        body: callSetup.body
      };
    } else {
      params = {
        headers: callSetup.headers,
        method: callSetup.method
      };
    }

    return await fetch(callSetup.endpoint, params)
      .then(resp => {
        if (resp.ok && resp.statusText.toLowerCase() === 'no content') {
          return {};
        } else if (resp.ok) {
          return resp.json();
        } else {
          const errMsg = resp.statusText + ' :: Code ' + resp.status;
          window.showErrorMessage('ERROR in OCAPI call: ' + errMsg);
          return { error: true, errorMessage: errMsg };
        }
      })
      .catch(err => {
        const errMsg = 'There was an error making the Open Commerce' +
        ' API call: ' + err.name + '\n' + 'Message: ' + err.message;
        window.showErrorMessage('ERROR in OCAPI call: ' + errMsg);
        return { error: true, errorMessage: errMsg };
      });
  }
}
