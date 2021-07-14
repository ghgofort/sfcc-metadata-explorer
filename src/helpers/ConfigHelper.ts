import { IDWConfig } from '../services/IDWConfig';
import { RelativePattern, workspace, window, Uri } from 'vscode';
import { createReadStream } from 'fs';
import { exportsConfig } from '../apiConfig';

/**
 * @class
 * @classdesc - A class for getting the configuration settings from dw.json.
 */
export default class ConfigHelper {
  private dwConfig: IDWConfig = {
    hostname: '',
    ok: false,
    password: '',
    username: ''
  };

  /**
   * Gets the sandbox connection configuration from a dw.json configuration file
   * in one of the workspace folders.
   *
   * @private
   * @return {IDWConfig} - Returns a Promise that resolves to a an
   *    object literal that conforms to the IDWConfig interface definition.
   * @author github: sqrtt
   *    This is a helper function that was borrowed from the Prophet debugger
   *    extension for debugging and development of SFCC code.
   */
  public async getDWConfig(): Promise<IDWConfig> {
    // Check if the configuration has already been loaded.
    if (
      this.dwConfig.hostname &&
      this.dwConfig.username &&
      this.dwConfig.password &&
      this.dwConfig.ok
    ) {
      return await Promise.resolve(this.dwConfig);
    } else {
      // Setup the default response.
      let result: IDWConfig = {
        hostname: '',
        ok: false,
        password: '',
        username: ''
      };

      // If there is no workspace, then exit w/message.
      if (!workspace.workspaceFolders) {
        window.showInformationMessage(
          'You must have a workspace configured to use dw.json configuration.');
        return result;
      }

      // Check all of the folders in the current workspace for the existance of
      // one or more dw.json files.
      const dwConfigFiles = await Promise.all(
        workspace.workspaceFolders.map(wf =>
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
      dwConfigFiles.forEach(uriSubArray => {
        configFiles = configFiles.concat(uriSubArray);
      });

      // Get rid of any paths that return undefined or null when evaluated.
      configFiles = configFiles.filter(Boolean);

      // 1 dw.json file found
      if (configFiles.length === 1 && configFiles[0].fsPath) {
        result = await this.readConfigFromFile(configFiles[0].fsPath);

        // > 1 dw.json file found
      } else if (configFiles.length > 1) {
        const dwConfig = await window.showQuickPick(
          configFiles.map(config => config.fsPath),
          { placeHolder: 'Select configuration' }
        ) || '';
        result = await this.readConfigFromFile(dwConfig);
      }

      return result;
    }
  }

  /**
   * Gets the available export options and the SiteArchiveExportConfiguration (SAEC) attribute names 
   * used for configuration of the SAEC object instance.
   */
  public getExportOptions(): { name: string, attribute: string }[] {
    return exportsConfig.map(name => {
      let camelName = name.substring(0, 1).toLowerCase() + name.substring(1).replace(/ /g, '');
      return {
        name: name,
        attribute: camelName
      };
    });
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

      readStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      readStream.on('error', (e: any) => {
        reject(e);
      });

      readStream.on('close', () => {
        try {
          const conf = JSON.parse(Buffer.concat(chunks).toString());
          conf.configFilename = filePath;
          conf.ok = true;
          resolve(conf);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
