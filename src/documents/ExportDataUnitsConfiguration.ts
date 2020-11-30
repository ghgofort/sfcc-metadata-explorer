import { getAPIVersion } from '../apiConfig';
import IAPIDocument from '../interfaces/IAPIDocument';
import { IOCAPITypes } from '../interfaces/IOCAPITypes';
import ExportGlobalDataConfiguration from './ExportGlobalDataConfiguration';
import ExportSitesConfiguration from './ExportSitesConfiguration';

/**
 * @class
 * @classdesc - A TS class for handling the OCAPI document type with the same
 *    name. This document is used to configure what data you would like to
 *    include in an archive export global job execution.
 */
export default class ExportDataUnitsConfiguration implements IAPIDocument {
  [index: string]: any;
  public catalogStaticResources: object = { all: false };
  public catalogs: object = { all: false };
  public customerLists: object = { all: false };
  public globalData: ExportGlobalDataConfiguration = new ExportGlobalDataConfiguration({});
  public inventoryLists: object = { all: false };
  public libraries: object = { all: false };
  public libraryStaticResources: object = { all: false };
  public priceBooks: object = { all: false };
  public sites: object = { all: new ExportSitesConfiguration({}) };
  public includedFields: string[] = [];
  public readonly MEMBER_MAP: IOCAPITypes.IDocumentObject = {
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
  constructor(args: any = {}) {
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
      if (args.libraries) {
        this.libraries = args.libraries;
      }
      if (args.price_books) {
        this.priceBooks = args.price_books;
      }
      if (args.sites) {
        this.sites = new ExportSitesConfiguration(args.sites);
      }
    }
  }

  public getDocument(includeFields: string[] = []) {
    const instance = this;
    const documentObj: IOCAPITypes.IDocumentObject = {};
    let memberNames = Object.keys(instance).filter(
      key =>
        typeof key !== 'function' &&
        key !== 'MEMBER_MAP' &&
        key !== 'includedFields'
    );

    // If the fields to return were specified, then filter the array of
    // properties to assign to the new object literal.
    if (includeFields && includeFields.length) {
      memberNames = memberNames.filter(
        name => includeFields.indexOf(name) > -1
      );
    } else if (instance.includedFields.length) {
      memberNames = memberNames.filter(
        name => instance.includedFields.indexOf(name) > -1
      );
    }

    // Create a property on the results object.
    memberNames.forEach(localPropName => {
      const docPropName: string = localPropName in instance.MEMBER_MAP ?
        instance.MEMBER_MAP[localPropName] : localPropName;
      const localPropVal = instance[localPropName];
      const isAll = localPropVal &&
        typeof localPropVal.all === 'boolean' &&
        localPropVal.all;

      if (localPropName === 'globalData') {
        documentObj[docPropName] = localPropVal.getDocument();
      }
    });

    return documentObj;
  }
}
