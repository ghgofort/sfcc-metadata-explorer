/**
 * @file OCAPIService
 * @fileoverview - Provides a service for making calls to the Open Commerce API
 *    when exposed on a Sales Force Commerce Cloud sandbox instance.
 */

import { createReadStream } from 'fs';
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

    // Check that calls to the specified resource have been configured in the
    // apiConig.ts configuration file.
    if (apiConfig.resources.hasOwnProperty(resourceName)) {
      resConfig = apiConfig.resources[resourceName];

      // Check if an API version is specified in the API configuration file.
      if (resConfig.api) {
        setupResult.endpoint += '/dw/' + resConfig.api + '/';

        // Check if the call name is configured for the specified resource.
        if (resConfig.availableCalls &&
          resConfig.availableCalls.hasOwnProperty(callName)
        ) {
          callConfig = resConfig.availableCalls[callName];
        }
      } else {
        setupResult.setupError = true;
        setupResult.setupErrMsg =
          'No API version was specified in the apiConfig object';
      }
    } else {
      setupResult.setupError = true;
      setupResult.setupErrMsg =
        'No setup was found in the apiConfig object for the specified resource';
    }

    if (callConfig) {
      // Get the sandbox configuration as a promise, and use the callbacks to
      // make the call to the OCAPI endpoint.
      this.getDWConfig().then(config => {
        setupResult.endpoint = config.endpoint + '/dw/' +
      }).catch(err => {
        /** @todo */
      });
    }

    return setupResult;
  }

  public makeCall(args: ICallSetup) {
    if (
      this.dwConfig.endpoint &&
      this.dwConfig.username &&
      this.dwConfig.password
    ) {
      if (this.authToken && this.authToken.isValid()) {
        /** @todo */
      } else {
        /** @todo */
      }
    } else {

    }

  }

  /**
   * @private
   * @author github: sqrtt
   * This is a helper function that was borrowed from the Prophet debugger
   * extension for debugging and development of SFCC code.
   */
  private getDWConfig(): Promise<IDWConfig | string> {
    // Check if the configuration has already been loaded.
    if (this.dwConfig.endpoint !== '') {
      return Promise.resolve(this.dwConfig);
    } else {
      // Check all of the folders in the current workspace for the existance of
      // one or more dw.json files.
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
              // Return an error to be displayed for the user.
              return Promise.reject('Unable to find sandbox config (dw.json)');
            } else if (uriPathArray.length === 1) {
              // If only one dw.json config file is found, then use it.
              return uriPathArray[0].fsPath;
            } else {
              // If there is more than one dw.json configuration file found in
              // the workspace, then show a quick-pick modal for the user to
              // select which configuration they would like to use.
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
  private getOAuth2Token(tokenType: string) {
    // Check if the configuration is loaded
    if (tokenType === 'BM_USER') {
      this.isGettingToken = true;
      const url = '';
      fetch(url, {
        /** @todo */
        a: url
      });
    } else if (tokenType === 'CLIENT_CREDENTIALS') {
      /** @todo: implement getOAuth2Token for auth server authentication */
    }
  }

  /**
   * Reads the SFCC sandbox configuration from a dw.json configuration file and
   * an object that conforms to the IDWConfig interface with key/value pairs for
   * the needed sandbox configuration fields.
   *
   * @param {string} filePath - The file path for the dwconfig.json file to be read.
   * @return {Promise<IDWConfig>} - Returns a promise that resolves with the
   *    configuration object read from the selected dw.json file.
   */
  private readConfigFromFile(filePath: string): Promise<IDWConfig> {
    return new Promise((resolve, reject) => {
      // Create a stream to read the data from the file.
      const chunks: Buffer[] = [];
      const readStream = createReadStream(filePath);

      readStream.on('data', chunk => {
        chunks.push(chunk);
      });

      readStream.on('error', e => {
        reject(e);
      });

      readStream.on('close', () => {
        try {
          const conf = JSON.parse(Buffer.concat(chunks).toString());
          conf.configFilename = filePath;
          resolve(conf);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
