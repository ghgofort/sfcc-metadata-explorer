/**
 * @file OCAPIService
 * @fileoverview - Provides a service for making calls to the Open Commerce API
 *    when exposed on a Sales Force Commerce Cloud sandbox instance.
 */

import fetch from 'node-fetch';
import {
  RelativePattern,
  Uri,
  window,
  workspace,
  WorkspaceFolder
} from 'vscode';
import { apiConfig } from '../apiConfig';
import { OAuth2Token } from '../authorization/OAuth2Token';
import { HTTP_VERB, ICallSetup } from './ICallSetup';
import { IDWConfig } from './IDWConfig';
import { createReadStream } from 'fs';

/**
 * @class OCAPIService
 * Proivdes REST request methods for making calls to the SFCC Open Commerce API.
 */
export default class OCAPIService {
  public authToken: OAuth2Token = null;
  private isGettingToken: boolean = false;
  private dwConfig: IDWConfig = {
    endpoint: '',
    password: '',
    username: ''
  };

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

  /**
   * @private
   * @author github: sqrtt
   * This is a helper function that was borrowed from the Prophet debugger
   * extension for debugging and development of SFCC code.
   */
  private getDWConfig(): Promise<IDWConfig> {
    if (this.dwConfig.endpoint !== '') {
      return Promise.resolve(this.dwConfig);
    } else {
      const workspaceFolders: WorkspaceFolder[] = workspace.workspaceFolders;
      const dwConfigFiles = Promise.all(
        workspaceFolders.map(wf =>
          workspace.findFiles(
            new RelativePattern(wf, '**/dw.json'),
            new RelativePattern(
              wf,
              '{node_modules,.git,RemoteSystemsTempFiles}'
            )
          )
        )
      );

      let configFiles: Uri[] = [];
      return dwConfigFiles
        .then(uriArrays => {
          uriArrays.forEach(uriSubArray => {
            configFiles = configFiles.concat(uriSubArray);
          });
          return configFiles;
        })
        .then(uriPathArray => {
          if (uriPathArray) {
            // Get rid of any paths that return undefined or null when evaluated.
            uriPathArray = uriPathArray.filter(Boolean);
            if (!uriPathArray.length) {
              return Promise.reject('Unable to find sandbox config (dw.json)');
            } else if (uriPathArray.length === 1) {
              return uriPathArray[0].fsPath;
            } else {
              return window.showQuickPick(
                uriPathArray.map(config => config.fsPath),
                { placeHolder: 'Select configuration' }
              );
            }
          } else {
            return Promise.reject('Unable to find sandbox config (dw.json).');
          }
        })
        .then(configPath => this.readConfigFromFile(configPath));
    }
  }

  private readConfigFromFile(filePath: string): Promise<IDWConfig> {
    // Create a stream to read the data from the file.
    const readStream = createReadStream(filePath);
    let chunks: Buffer[] = [];

    readStream.on('data', chunk => {
      chunks.push(chunk);
    });

    /** @todo:
     *    - Complete the read operation.
     *    - handle read errors.
     *    - Add Try/Catch block.
     *    - Return results as a promise?
     */
  }

  private getOAuth2Token(tokenType: string) {
    // Check if the configuration is loaded
    if (tokenType === 'bmUser') {
      this.isGettingToken = true;
      const url = '';
      fetch(url, {
        /** @todo */
        a: url
      });
    } else if (tokenType === 'authServer') {
      /** @todo: implement getOAuth2Token for auth server authentication */
    }
  }
}
