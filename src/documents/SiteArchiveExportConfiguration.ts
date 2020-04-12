import IAPIDocument from '../interfaces/IAPIDocument';

/**
 * @class
 * @classdesc - OCAPI SearchArchiveExportConfiguration document class for TS.
 *    The OCAPI document is passed to the Jobs resource to execute the global
 *    system job sfcc-site-archive-export for creating export files on server.
 */
export default class SearchArchiveExportConfiguration implements IAPIDocument {
  public dataUnits: ExportDataUnitConfiguration;

  public includedFields: string[] = [];
  public readonly MEMBER_MAP = {
    dataUnits: 'data_units',
    exportFile: 'export_file',
    overwriteExportFile: 'overwrite_export_file'
  };

  /**
   * @param {Object} [args] - An optional argumanet for passing the raw JSON
   *    OCAPI body for SiteArchiveExportConfiguration type.
   * @constructor
   */
  constructor(args) {
    if (args) {

    }
  }

  public getDocument() {
    return {};
  }
}
