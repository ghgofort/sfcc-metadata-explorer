import IAPIDocument from '../interfaces/IAPIDocument';

/**
 * @class
 * @classdesc - TS class for handling the ExportGlobalDataConfiguration OCAPI
 *    document type which is used to configure the global exports that will be
 *    included in an execution of Global SFCC Job `sfcc-site-archive-export`.
 */
export default class ExportGlobalDataConfiguration implements IAPIDocument {
  public includedFields: string[] = [];
  public readonly MEMBER_MAP = {
    dataUnits: 'data_units',
    exportFile: 'export_file',
    overwriteExportFile: 'overwrite_export_file'
  };

  /**
   * @param {Object} [args] - An optional arguments parameter to pass the raw
   *    JSON object for the document as an argument to construct the isntance.
   * @constructor
   */
  constructor(args) {
    /** @todo:  */
  }

  public getDocument() {
    return {};
  }
}
