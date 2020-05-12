import IAPIDocument from '../interfaces/IAPIDocument';
import { IOCAPITypes } from '../interfaces/IOCAPITypes';

/**
 * @class
 * @classdesc - OCAPI Data JobExecutionRequest document class.
 */
export default class JobExecutionRequest implements IAPIDocument {
  public includedFields: string[] = [];
  public readonly MEMBER_MAP = {};
  public parameters: IOCAPITypes.IJobExecutionParameter[] = [];

  /**
   * @param {Object} [args] - Accepts the raw JobExecutionRequest JSON as an
   *    optional parameter.
   * @constructor
   */
  constructor(args) {
    if (args && args.parameters) {
      this.parameters = args.parameters;
    }
  }

  public getDocument() {
    return { parameters: this.parameters };
  }
}
