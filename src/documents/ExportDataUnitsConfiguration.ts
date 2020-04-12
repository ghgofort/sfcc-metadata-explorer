import IAPIDocument from '../interfaces/IAPIDocument';

/**
 * @class
 * @classdesc - A TS class for handling the OCAPI document type with the same
 *    name. This document is used to configure what data you would like to
 *    include in an archive export global job execution.
 */
export default class ExportDataUnitsConfiguration implements IAPIDocument {
  public catalogStaticResources: Map<string, boolean> = new Map();
  public includedFields: string[] = [];
  public readonly MEMBER_MAP = {

  };

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
