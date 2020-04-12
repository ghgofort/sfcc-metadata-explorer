import IAPIDocument from '../interfaces/IAPIDocument';

/**
 * @class
 * @classdesc - A TS class for handling the OCAPI ExportSitesConfiguration
 *    document type which is used for configuring what data from each
 *    site will be exported when running the sfcc-site-archive-export Global
 *    job.
 */
export default class ExportSitesConfiguration implements IAPIDocument {
  public MEMBER_MAP = {};
  public includedFields = [];

  /**
   * @param {Object} args - constructor param doc
   * @constructor
   */
  constructor(args) {
    /** @todo:  */
  }

  public getDocument() {
    return {};
  }
}
