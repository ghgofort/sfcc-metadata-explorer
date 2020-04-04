/**
 * @file SitesHelper.ts
 * @fileoverview - Class for helping with Sites API resource call setup & result handling.
 */

import { window } from 'vscode';
import Sites from '../documents/Sites';
import { OCAPIService } from '../services/OCAPIService';

/**
 * @class
 * @classdesc - Class that exports methods for handling API calls to the OCAPI
 *    Data API's Sites resource.
 */
export default class SitesHelper {
  private service: OCAPIService = new OCAPIService();

  /**
   * @function getAllSites - Gets all of the sites from the configured instance.
   *
   * @return {Sites} - Returns an instance of the Sites document class.
   */
  public async getAllSites(groupId): Promise<Sites> {
    try {
      const _callSetup = await this.service.getCallSetup('sites', 'getAll', {
        select: '(**)',
        objectType: 'Sites',
      });
      const _callResult = await this.service.makeCall(_callSetup);

      if (!_callResult.error &&
        typeof _callResult.count !== 'undefined' &&
        _callResult.count === 0
      ) {
        window.showErrorMessage('No Sites Found.');
        return Promise.reject('No Sites Found.');
      } else if (_callResult.error || typeof _callResult.count === 'undefined') {
        window.showErrorMessage('Unable to get sites, ' +
          'there was an error calling the API');
        console.log(JSON.stringify(_callResult));
      } else {
        return new Sites(_callResult);
      }
    } catch (e) {
      window.showErrorMessage('ERROR making call to OCAPI: ' + e.message);
    }
    return Promise.reject('Error making call to OCAPI');

  }
}

