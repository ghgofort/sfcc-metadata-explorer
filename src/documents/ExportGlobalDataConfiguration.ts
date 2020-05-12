import { getAPIVersion } from '../apiConfig';
import IAPIDocument from '../interfaces/IAPIDocument';

/**
 * @class
 * @classdesc - TS class for handling the ExportGlobalDataConfiguration OCAPI
 *    document type which is used to configure the global exports that will be
 *    included in an execution of Global SFCC Job `sfcc-site-archive-export`.
 */
export default class ExportGlobalDataConfiguration implements IAPIDocument {
  public accessRoles: boolean = false;
  public all: boolean = false;
  public cscSettings: boolean = false;
  public csrfWhitelists: boolean = false;
  public customPreferenceGroups: boolean = false;
  public customQuotaSettings: boolean = false;
  public customTypes: boolean = false;
  public geolocations: boolean = false;
  public globalCustomObjects: boolean = false;
  public jobSchedules: boolean = false;
  public jobSchedulesDeprecated: boolean = false;
  public locales: boolean = false;
  public oauthProviders: boolean = false;
  public ocapiSettings: boolean = false;
  public pageMetaTags: boolean = false;
  public preferences: boolean = false;
  public priceAdjustmentLimits: boolean = false;
  public services: boolean = false;
  public sortingRules: boolean = false;
  public staticResources: boolean = false;
  public systemTypeDefinitions: boolean = false;
  public users: boolean = false;
  public webdavClientPermissions: boolean = false;

  public includedFields: string[] = [];
  public readonly MEMBER_MAP = {
    accessRoles: 'access_roles',
    cscSettings: 'csc_settings',
    csrfWhitelists: 'csrf_whitelists',
    customPreferenceGroups: 'custom_preference_groups',
    customQuotaSettings: 'custom_quota_settings',
    customTypes: 'custom_types',
    globalCustomObjects: 'global_custom_objects',
    jobSchedules: 'job_schedules',
    jobSchedulesDeprecated: 'job_schedules_deprecated',
    oauthProviders: 'oauth_providers',
    ocapiSettings: 'ocapi_settings',
    pageMetaTags: 'page_meta_tags',
    priceAdjustmentLimits: 'price_adjustment_limits',
    sortingRules: 'sorting_rules',
    staticResources: 'static_resources',
    systemTypeDefinitions: 'system_type_definitions',
    webdavClientPermissions: 'webdav_client_permissions'
  };

  /**
   * @param {Object} [args] - An optional arguments parameter to pass the raw
   *    JSON object for the document as an argument to construct the isntance.
   * @constructor
   */
  constructor(args: any = {}) {
    if (args) {
      this.accessRoles = typeof args.access_roles !== 'undefined' ? args.access_roles : false;
      this.all = typeof args.all !== 'undefined' ? args.all : false;
      this.cscSettings = typeof args.csc_settings !== 'undefined' ? args.cscSettings : false;
      this.csrfWhitelists = typeof args.csrf_whitelists !== 'undefined' ? args.csrfWhitelists : false;
      this.customPreferenceGroups = typeof args.customPreferenceGroups !== 'undefined' ?
        args.customPreferenceGroups : false;
      this.customQuotaSettings = typeof args.customQuotaSettings !== 'undefined' ? args.customQuotaSettings : false;
      this.customTypes = typeof args.customTypes !== 'undefined' ? args.customTypes : false;
      this.geolocations = typeof args.geolocations !== 'undefined' ? args.geolocations : false;
      this.globalCustomObjects = typeof args.globalCustomObjects !== 'undefined' ? args.globalCustomObjects : false;
      this.jobSchedules = typeof args.jobSchedules !== 'undefined' ? args.jobSchedules : false;
      this.jobSchedulesDeprecated = typeof args.jobSchedulesDeprecated !== 'undefined' ?
        args.jobSchedulesDeprecated : false;
      this.locales = typeof args.locales !== 'undefined' ? args.locales : false;
      this.oauthProviders = typeof args.oauthProviders !== 'undefined' ? args.oauthProviders : false;
      this.ocapiSettings = typeof args.ocapiSettings !== 'undefined' ? args.ocapiSettings : false;
      this.pageMetaTags = typeof args.pageMetaTags !== 'undefined' ? args.pageMetaTags : false;
      this.preferences = typeof args.preferences !== 'undefined' ? args.preferences : false;
      this.priceAdjustmentLimits = typeof args.priceAdjustmentLimits !== 'undefined' ?
        args.priceAdjustmentLimits : false;
      this.services = typeof args.services !== 'undefined' ? args.services : false;
      this.sortingRules = typeof args.sortingRules !== 'undefined' ? args.sortingRules : false;
      this.staticResources = typeof args.staticResources !== 'undefined' ? args.staticResources : false;
      this.systemTypeDefinitions = typeof args.systemTypeDefinitions !== 'undefined' ?
        args.systemTypeDefinitions : false;
      this.users = typeof args.users !== 'undefined' ? args.users : false;
      this.webdavClientPermissions = typeof args.webdavClientPermissions !== 'undefined' ?
        args.webdavClientPermissions : false;
    }
  }

  /**
   * Gets the OCAPI document object for sending in an API request.
   * @param {string[]} includeFields - An optional array of fields can be
   *    specified to send only specific attribute values.
   * @return {Object} - Returns the OCAPI format object w/snake-case naming.
   */
  public getDocument(includeFields: string[] = []) {
    const documentObj = {};
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

    memberNames.forEach(localPropName => {
      const docPropName: string = localPropName in this.MEMBER_MAP ?
        this.MEMBER_MAP[localPropName] : localPropName;

      if (typeof this[localPropName] !== 'undefined') {
        documentObj[docPropName] = this[localPropName];
      }
    });

    return documentObj;
  }
}
