import IAPIDocument from '../interfaces/IAPIDocument';
import ExportGlobalDataConfiguration from './ExportGlobalDataConfiguration';
import ExportSitesConfiguration from './ExportSitesConfiguration';

/**
 * @class
 * @classdesc - A TS class for handling the OCAPI document type with the same
 *    name. This document is used to configure what data you would like to
 *    include in an archive export global job execution.
 */
export default class ExportDataUnitsConfiguration implements IAPIDocument {
  public catalogStaticResources: object = { all: true };
  public catalogs: object = { all: true };
  public customerLists: object = { all: true };
  public globalData: ExportGlobalDataConfiguration = new ExportGlobalDataConfiguration();
  public inventoryLists: object = { all: true };
  public libraries: object = { all: true };
  public libraryStaticResources: object = { all: true };
  public priceBooks: object = { all: true };
  public sites: object = { all: new ExportSitesConfiguration() };
  public includedFields: string[] = [];
  public readonly MEMBER_MAP = {
    catalogStaticResources: 'catalog_static_resources',
    customerLists: 'customer_lists',
    globalData: 'global_data',
    inventoryLists: 'inventory_lists',
    libraryStaticResources: 'library_static_resources',
    priceBooks: 'price_books'
  };

  /**
   * @param {Object} args - constructor param doc
   * @constructor
   */
  constructor(args) {
    if (args) {
      // Add the objects to the key map
      if (args.catalog_static_resources) {
        this.catalogStaticResources = args.catalog_static_resources;
      }
      if (args.catalogs) {
        this.catalogs = args.catalogs;
      }
      if (args.customer_lists) {
        this.customerLists = args.customer_lists;
      }
      if (args.global_data) {
        this.globalData = new ExportGlobalDataConfiguration(args.global_data);
      }
      if (args.inventory_lists) {
        this.inventoryLists = args.inventory_lists;
      }
      if (args.price_books) {
        this.priceBooks = args.price_books;
      }

    }
  }

  public getDocument(includeFields: string[] = []) {
    return {};
  }
}
