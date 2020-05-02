import { getAPIVersion } from '../apiConfig';
import IAPIDocument from '../interfaces/IAPIDocument';
import ExportDataUnitsConfiguration from './ExportDataUnitsConfiguration';

/**
 * @class
 * @classdesc - OCAPI SearchArchiveExportConfiguration document class for TS.
 *    The OCAPI document is passed to the Jobs resource to execute the global
 *    system job sfcc-site-archive-export for creating export files on server.
 */
export default class SiteArchiveExportConfiguration implements IAPIDocument {
  public dataUnits: ExportDataUnitsConfiguration = new ExportDataUnitsConfiguration();
  public exportFile: string = '';
  public overwriteExportFile: boolean = true;

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
  constructor(args: any = {}) {
    const instance = this;
    if (args) {
      this.exportFile = args.export_file || './sfccMetaExplorerExport';
      this.overwriteExportFile = typeof args.overwrite_export_file === 'boolean' &&
        args.overwrite_export_file;
      if (args.data_units) {
        this.dataUnits = new ExportDataUnitsConfiguration(args.data_units);
      }
    }
  }

  /**
   * Gets the OCAPI document.
   * @return {Object} - Returns the SiteArchiveExportConfiguration OCAPI doc.
   */
  public getDocument() {
    const docObj = {
      '_v': getAPIVersion(),
      'data_units': this.dataUnits.getDocument(),
      'export_file': this.exportFile,
      'overwrite_export_file': this.overwriteExportFile
    };

    return docObj;
  }
}
