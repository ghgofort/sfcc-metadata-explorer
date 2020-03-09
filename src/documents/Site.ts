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
export default class Site {
  public cartridges: String;
  public customerListLink: IOCAPITypes.ICustomerListLink;
  public description: IOCAPITypes.ILocalizedString;
  public displayName: IOCAPITypes.ILocalizedString;
  public id: String;
  public inDeletion: Boolean;
  public link: String;
  public storefrontStatus: String;

  /**
   * @param {Object} args - The raw JSON result for the Sites call.
   * @constructor
   */
  constructor(args) {
    this.cartridges = args && args.cartridges ? args.cartridges : '';
    this.id = args && args.id ? args.id : '';
    this.inDeletion = args && args.in_deletion;
    this.link = args && args.link ? args.link : '';
    this.storefrontStatus = args && args.storefront_status ? args.storefront_status : '';

    if (args && args.customerListLink) {
      let title: IOCAPITypes.ILocalizedString = { default: '' };
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
        title: title
      };
    }
  }

}
