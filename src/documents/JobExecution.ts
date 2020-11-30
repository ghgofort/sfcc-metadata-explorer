import IAPIDocument from '../interfaces/IAPIDocument';
import { IOCAPITypes } from '../interfaces/IOCAPITypes';
import JobStepExecution from './JobStepExecution';

/**
 * @class
 * @classdesc - TS class for handling OCAPI JobsExecution documents.
 */
export default class JobsExecution implements IAPIDocument {
  public clientId: string = '';
  public duration: number = 0;
  public endTime: Date;
  public executionScopes: string[] = [];
  public exitStatus: IOCAPITypes.IStatus = { code: '', message: '', status: 'ok' };
  public id: string = '';
  public isLogFileExisting: boolean = false;
  public isRestart: boolean = false;
  public jobDescription: string = '';
  public jobId: string = '';
  public logFileName: string = '';
  public modificationTime: Date;
  public parameters: IOCAPITypes.IJobExecutionParameter[] = [];
  public startTime: Date;
  public status: string = '';
  public stepExecutions: JobStepExecution[] = [];
  public includedFields: string[] = [];

  // members that need to be renamed when sending the doc.
  public readonly MEMBER_MAP = {
    clientId: 'client_id',
    endTime: 'end_time',
    executionScopes: 'execution_scopes',
    exitStatus: 'exit_status',
    isLogFileExisting: 'is_log_file_existing',
    isRestart: 'is_restart',
    jobDescription: 'job_description',
    jobId: 'job_id',
    logFileName: 'log_file_name',
    modificationTime: 'modification_time',
    startTime: 'start_time',
    stepExecutions: 'step_executions'
  };

  /**
   * @param {Object} args - Accepts the raw JSON for a JobExecution response as
   *    the an optional paramter.
   * @constructor
   */
  constructor(args: any) {
    if (args) {
      // Set string & string[] property values.
      this.clientId = args.client_id ? args.client_id : '';
      this.id = args.id ? args.id : '';
      this.jobDescription = args.job_description ? args.job_description : '';
      this.jobId = args.job_id ? args.job_id : '';
      this.logFileName = args.log_file_name ? args.log_file_name : '';
      this.status = args.status ? args.status : '';
      this.parameters = args.parameters && args.parameters.length ? args.parameters : [];

      // Set boolean property values.
      this.isLogFileExisting = typeof args.is_log_file_existing !== 'undefined' &&
        args.is_log_file_existing;
      this.isRestart = typeof args.is_restart !== 'undefined' && args.is_restart;

      // Set exitStatus property value.
      if (args.exit_status) {
        this.exitStatus = {
          code: args.exit_status.code || '',
          message: args.exit_status.message || '',
          status: args.exit_status.status || 'ok'
        };
      }

      // Set executionScopes property value.
      if (args.execution_scopes && args.execution_scopes.length) {
        this.executionScopes = args.execution_scopes;
      }
    }

    // Set Date field values.
    this.endTime = args && args.end_time ? new Date(args.end_time) : new Date();
    this.startTime = args && args.start_time ? new Date(args.start_time) : new Date();
    this.modificationTime = args && args.modification_time ?
      new Date(args.modification_time) : new Date();
  }

  public getDocument() {
    return {};
  }
}
