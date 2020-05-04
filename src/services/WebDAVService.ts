import fetch from 'node-fetch';
import { IDWConfig } from './IDWConfig';
import ConfigHelper from '../helpers/ConfigHelper';

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

  public async getFileFromServer(path: string) {
    const fs = require('fs');
    const util = require('util');
    const zlib = require('zlib')
    const chunks: Buffer[] = [];
    // Get the config from the dw.json file for auth.
    this.dwConfig = await this.ConfigHelper.getDWConfig();
    if (!this.dwConfig.ok) {
      return Promise.reject('Config is invalid');
    }

    // Set the hostname from dw.json to URL.
    const url = path.replace('{0}', this.dwConfig.hostname);

    // Get Basic Auth credentials & encode to base64.
    let authCreds = this.dwConfig.username + ':' + this.dwConfig.password;
    authCreds = Buffer.from(authCreds).toString('base64');

    // Setup the call.
    const options = {
      headers: {
        'Authorization': 'Basic ' + authCreds
      }
    };

    console.log('url for webdav: ', url);
    console.log('options for webdav: ', options);

    const streamPipe = util.promisify(require('stream').pipeline);

    return fetch(url, options)
      .then(res => {
        console.log(res.headers.raw());
        return streamPipe(res.body, fs.createWriteStream('sfccExport.zip'));
      })
      .catch(err =>{
        console.error(err);
      });
  }
}
