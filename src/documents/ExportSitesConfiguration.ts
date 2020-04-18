import IAPIDocument from '../interfaces/IAPIDocument';

/**
 * @class
 * @classdesc - A TS class for handling the OCAPI ExportSitesConfiguration
 *    document type which is used for configuring what data from each
 *    site will be exported when running the sfcc-site-archive-export Global
 *    job.
 */
export default class ExportSitesConfiguration implements IAPIDocument {
  public abTests: boolean = true;
  public activeDataFeeds: boolean = true;
  public all: boolean = true;
  public cacheSettings: boolean = true;
  public campaignsAndPromotions: boolean = true;
  public content: boolean = true;
  public coupons: boolean = true;
  public customObjects: boolean = true;
  public customerCDNSettings: boolean = true;
  public customerGroups: boolean = true;
  public distributedCommerceExtensions: boolean = true;
  public dynamicFileResources: boolean = true;
  public giftCertificates: boolean = true;
  public ocapiSettings: boolean = true;
  public paymentMethods: boolean = true;
  public paymentProcessors: boolean = true;
  public redirectUrls: boolean = true;
  public searchSettings: boolean = true;
  public shipping: boolean = true;
  public siteDescriptor: boolean = true;
  public sitePreferences: boolean = true;
  public sitemapSettings: boolean = true;
  public slots: boolean = true;
  public sortingRules: boolean = true;
  public sourceCodes: boolean = true;
  public staticDynamicAliasMappings: boolean = true;
  public stores: boolean = true;
  public tax: boolean = true;
  public urlRules: boolean = true;

  public MEMBER_MAP = {
    abTests: 'ab_tests',
    activeDataFeeds: 'active_data_feeds',
    all: 'all',
    cacheSettings: 'cache_settings',
    campaignsAndPromotions: 'campaigns_and_promotions',
    content: 'content',
    coupons: 'coupons',
    customObjects: 'custom_objects',
    customerCDNSettings: 'customer_cdn_settings',
    customerGroups: 'customer_groups',
    distributedCommerceExtensions: 'distributed_commerce_extensions',
    dynamicFileResources: 'dynamic_file_resources',
    giftCertificates: 'gift_certificates',
    ocapiSettings: 'ocapi_settings',
    paymentMethods: 'payment_methods',
    paymentProcessors: 'payment_processors',
    redirectUrls: 'redirect_urls',
    searchSettings: 'search_settings',
    shipping: 'shipping',
    siteDescriptor: 'site_descriptor',
    sitePreferences: 'site_preferences',
    sitemapSettings: 'sitemap_settings',
    slots: 'slots',
    sortingRules: 'sorting_rules',
    sourceCodes: 'source_codes',
    staticDynamicAliasMappings: 'static_dynamic_alias_mappings',
    stores: 'stores',
    tax: 'tax',
    urlRules: 'url_rules'
  };

  public includedFields = [];

  /**
   * @param {Object} args - constructor param doc
   * @constructor
   */
  constructor(args = {}) {
    const instance = this;
    if (args) {
      Object.keys(instance.MEMBER_MAP).forEach(key => {
        if (typeof args[instance.MEMBER_MAP[key]] !== 'undefined') {
          instance[key] = args[instance.MEMBER_MAP[key]];
        } else {
          instance[key] = false;
        }
      });
    } else {
      // If no args are passed, set false for all.
      Object.keys(instance.MEMBER_MAP).forEach(key => {
        this[key] = false;
      });
    }
  }

  /**
   * Gets the object with OCAPI snake_case named properties for sending in API
   * call payloads.
   * @returns {object} - Returns the OCAPI document object.
   */
  public getDocument(): object {
    const instance = this;
    const docObj = {};
    Object.keys(instance.MEMBER_MAP).forEach(key => {
      docObj[instance.MEMBER_MAP[key]] = instance[key];
    });

    return docObj;
  }
}
