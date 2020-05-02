import { window } from 'vscode';
import SiteArchiveExportConfiguration from '../documents/SiteArchiveExportConfiguration';
import { ICallSetup } from '../services/ICallSetup';
import { OCAPIService } from '../services/OCAPIService';

/**
 * @class
 * @classdesc - A helper class for handling API calls to OCAPI for triggering
 *     system export jobs, and retreiving the export files.
 */
export default class ExportHelper {
  private ocapiService = new OCAPIService();

  /**
   * Gets the JobExecution OCAPI Document for the specified Job Id.
   * @param {string} jobId - The Id of the job that was executed.
   * @param {string} executionId - The Id of the execution to retrieve results from.
   * @return {Promise<any>} - Returns a Promise that resolves to the JobExecution
   *    JSON result from the server.
   */
  public async getJobExecution(jobId: string, executionId: string): Promise<any> {
    let callSetup: ICallSetup = null;
    let callResult: any;

    // Guard against missing data.
    if (!jobId || !executionId) {
      window.showErrorMessage('Error getting job execution result from server.');
    }

    const callData = {
      job_id: jobId,
      execution_id: executionId
    };

    try {
      callSetup = await this.ocapiService.getCallSetup(
        'jobs', 'getExecution', callData);
      console.log(callSetup);
      callResult = await this.ocapiService.makeCall(callSetup);
      console.log(callResult);
    } catch (e) {
      window.showErrorMessage('Error getting job execution results from server');
      console.error(e);
      return Promise.reject(e);
    }

    Promise.resolve(callResult);
  }

  /**
   * Runs the system global job `sfcc-site-archive-export`.
   * @param {SiteArchiveExportConfiguration} SAEConfig - The OCAPI document to
   *    use as the body of the request.
   */
  public async runSystemExport(SAEConfig: SiteArchiveExportConfiguration): Promise<any> {
    let callSetup: ICallSetup = null;
    let callResult: any;
    const callData = {
      job_id: 'sfcc-site-archive-export',
      body: JSON.stringify(SAEConfig.getDocument())
    };

    try {
      callSetup = await this.ocapiService.getCallSetup(
        'jobs',
        'executeJob',
        callData
      );
      console.log(callSetup);
      callResult = await this.ocapiService.makeCall(callSetup);
      console.log(callResult);
    } catch (e) {
      window.showErrorMessage('There was an error running the system export job');
      console.error(e);
    }

    return Promise.resolve(callResult);
  }
}
