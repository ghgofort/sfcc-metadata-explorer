import fetch from 'node-fetch';
import { IDWConfig } from './IDWConfig';
import ConfigHelper from '../helpers/ConfigHelper';
import { workspace, WorkspaceFolder } from 'vscode';

/**
 * WebDAVService.ts
 * A service class used for connecting to an SFCC instance using the WebDAV
 * protocol to upload/download files to/from the IMPEX & other server dirs.
 */

/**
 * @class
 * @classdesc - Service for making WebDAV requests.
 */
export default class WebDAVService {
  private ConfigHelper = new ConfigHelper();
  private dwConfig: IDWConfig = {
    hostname: '',
    ok: false,
    password: '',
    username: ''
  };

  public async getFileFromServer(serverPath: string) {
    const fs = require('fs');
    const path = require('path');
    const util = require('util');
    const zlib = require('zlib')
    const chunks: Buffer[] = [];
    // Get the config from the dw.json file for auth.
    this.dwConfig = await this.ConfigHelper.getDWConfig();
    if (!this.dwConfig.ok || !workspace.workspaceFolders) {
      return Promise.reject('Config is invalid');
    }

    // Set the hostname from dw.json to URL.
    const url = serverPath.replace('{0}', this.dwConfig.hostname);

    // Get Basic Auth credentials & encode to base64.
    let authCreds = this.dwConfig.username + ':' + this.dwConfig.password;
    authCreds = Buffer.from(authCreds).toString('base64');

    // Setup the call.
    const options = {
      headers: {
        'Authorization': 'Basic ' + authCreds
      }
    };

    const streamPipe = util.promisify(require('stream').pipeline);
    const currentPath = !workspace.workspaceFolders ? workspace.rootPath :
      workspace.workspaceFolders[0].uri.fsPath;

    const filePath = currentPath + path.sep + 'sfccExport.zip';

    return fetch(url, options)
      .then(res => {
        return streamPipe(res.body, fs.createWriteStream(filePath));
      })
      .catch(err =>{
        console.error(err);
      });
  }
}
