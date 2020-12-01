import IAPIDocument from '../interfaces/IAPIDocument';

/**
 * @class
 * @classdesc - Used for handling JobStepExecution OCAPI documents in TS code.
 */
export default class JobStepExecution implements IAPIDocument {
  public chunkSize: number = 0;
  public duration: number = 0;
  public endTime: Date;
  public executionScope: string = '';
  public exitStatus: string = '';
  public id: string = '';
  public includeStepsFromJobId: string = '';
  public isChunkOriented: boolean = false;
  public itemFilterCount: number = 0;
  public itemWriteCount: number = 0;
  public modificationTime: Date = new Date();
  public startTime: Date = new Date();
  public status: string = '';
  public stepDescription: string = '';
  public stepId: string = '';
  public stepTypeId: string = '';
  public stepTypeInfo: string = '';
  public totalItemCount: number = 0;
  public includedFields: string[] = [];

  // Maps snake_case naming to camelCase naming.
  public readonly MEMBER_MAP = {
    chunkSize: 'chunk_size',
    endTime: 'end_time',
    executionScope: 'execution_scope',
    exitStatus: 'exit_status',
    includeStepsFromJobId: 'include_steps_from_job_id',
    isChunkOriented: 'is_chunk_oriented',
    itemFilterCount: 'item_filter_count',
    itemWriteCount: 'item_write_count',
    modificationTime: 'modification_time',
    startTime: 'start_time',
    stepDescription: 'step_description',
    stepId: 'step_id',
    stepTypeId: 'step_type_id',
    stepTypeInfo: 'step_type_info',
    totalItemCount: 'total_item_count'
  };

  /**
   * @constructor
   * @param {Object} args - Raw JSON response from OCAPI.
   */
  constructor(args: any) {
    if (args) {
      // Number type fields
      this.chunkSize = args.chunk_size || 0;
      this.duration = args.duration || 0;
      this.itemFilterCount = args.item_filter_count || 0;
      this.itemWriteCount = args.item_write_count || 0;
      this.totalItemCount = args.total_item_count || 0;

      // String type fields
      this.executionScope = args.execution_scope || '';
      this.exitStatus = args.exit_status || '';
      this.id = args.id || '';
      this.includeStepsFromJobId = args.include_steps_from_job_id || '';
      this.status = args.status || '';
      this.stepDescription = args.step_description || '';
      this.stepId = args.step_id || '';
      this.stepTypeId = args.step_type_id || '';
      this.stepTypeInfo = args.stepTypeInfo || '';

      // Other
      this.isChunkOriented = typeof args.is_chunk_oriented !== 'undefined' &&
        args.is_chunk_oriented;
    }

    // Set date fields.
    this.endTime = args && args.end_time ? new Date(args.end_time) : new Date();
    this.endTime = args && args.modification_time ? new Date(args.modification_time) : new Date();
    this.endTime = args && args.start_time ? new Date(args.start_time) : new Date();
  }

  /**
   * @memberof JobStepExecution
   */
  public getDocument(): object {
    const result = {};
    return result;
  }
}
