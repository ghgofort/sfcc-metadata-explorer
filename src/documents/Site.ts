import { apiConfig, getAPIVersion } from '../apiConfig';
import IAPIDocument from '../interfaces/IAPIDocument';
import { IOCAPITypes } from '../interfaces/IOCAPITypes';

/**
 * Site.ts
 *
 * Exports a document class for handling the OCAPI Site Data API document.
 */

/**
 * @class
 * @classdesc - A class for handling the Site API document for recieving &
 *    sending API calls that require the Site document.
 */
export default class Site implements IAPIDocument {
  [index: string]: any;
  public cartridges: string;
  public customerListLink: IOCAPITypes.ICustomerListLink = {
    customer_list_id: '',
    link: '',
    title: {default: ''}
  };
  public description: IOCAPITypes.ILocalizedString = {default: ''};
  public displayName: IOCAPITypes.ILocalizedString = {default: ''};
  public id: string;
  public inDeletion: boolean;
  public link: string;
  public storefrontStatus: string;
  public includedFields: string[] = [];

  public readonly MEMBER_MAP: IOCAPITypes.IDocumentObject = {
    customerListLink: 'customer_list_link',
    inDeletion: 'in_deletion',
    storefrontStatus: 'storefront_status'
  };

  /**
   * @param {Object} args - The raw JSON result for the Sites call.
   * @constructor
   */
  constructor(args: any) {
    this.cartridges = args && args.cartridges ? args.cartridges : '';
    this.id = args && args.id ? args.id : '';
    this.inDeletion = args && args.in_deletion;
    this.link = args && args.link ? args.link : '';
    this.storefrontStatus = args && args.storefront_status ? args.storefront_status : '';

    if (args && args.customerListLink) {
      const title: IOCAPITypes.ILocalizedString = { default: '' };
      if (args.customerListLink.title && args.customerListLink.title.default) {
        const localeKeys = Object.keys(args.customerListLink.title).filter(key => key !== 'default');
        title.default = args.customerListLink.title.default;
        if (localeKeys.length) {
          localeKeys.forEach(lKey => {
            title[lKey] = args.customerListLink.title[lKey];
          });
        }
      }

      this.customerListLink = {
        customer_list_id: args.customerListLink.id || '',
        link: args.customerListLink.link || '',
        title
      };
    }
  }

  /**
   * Gets the OCAPI document format object literal that can be strigified for a
   * request to the API.
   * @param {string[]} [includeFields] - An optional argument to specify a
   *    subset of fields to include in the document. If not specified, then all
   *    fields will be included.
   * @return {IGetDocument}
   */
  public getDocument(includeFields: string[] = []): object {
    const documentObj: IOCAPITypes.IDocumentObject = {};
    let memberNames = Object.keys(this).filter(
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
    } else if (this.includedFields.length) {
      memberNames = memberNames.filter(
        name => this.includedFields.indexOf(name) > -1
      );
    }

    // Create a property on the results object.
    memberNames.forEach(localPropName => {
      const docPropName: string = localPropName in this.MEMBER_MAP ?
        this.MEMBER_MAP[localPropName] : localPropName;
      let localPropVal: any;

      if (typeof this[localPropName] !== 'undefined') {
        localPropVal = this[localPropName];
        const isComplexType =
          typeof localPropVal !== 'number' &&
          typeof localPropVal !== 'string' &&
          typeof localPropVal !== 'boolean';

        if (!isComplexType) {
          documentObj[docPropName] = localPropVal;
        } else if (docPropName === 'customerListLink') {
            const title = { default: '' };
            title.default = localPropVal.title && localPropVal.title.default || '';

            documentObj[docPropName] = {
              customerListId: localPropVal.customer_list_id || '',
              link: localPropVal.link || '',
              title
            };
        } else {
          // ==> ILocalizedString - this.description & this.displayName
          documentObj[docPropName] = localPropVal;
        }
      }
    });

    // tslint:disable-next-line: no-string-literal
    documentObj['_v'] = getAPIVersion();

    return documentObj;
  }
}
