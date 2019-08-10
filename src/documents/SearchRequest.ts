/**
 * @file SearchRequest.ts
 * @fileoverview - Exports a class for handling Open Commerce API SearchRequest
 * document requests & responses.
 */

import IAPIDocument from '../interfaces/IAPIDocument';
import Query from './Query';
import Sort from './Sort';

/**
 * @class
 * @classdesc - A data model class for working with OCAPI SearchRequest
 * Document types when making queries.
 */
export class SearchRequest implements IAPIDocument {
  public includedFields: string[] = [];
  public readonly MEMBER_MAP = {
    dbStartRecord: 'db_start_record'
  };

  /* Member Variables */
  public count: number = 0;
  public dbStartRecord: number = 0;
  public expand: string[] = [];
  public query: Query;
  public select: string = '';
  public sorts: Sort[] = [];

  /**
   * @constructor
   * @param {Object} [args] - The raw OCAPI document can be passed into the
   *    constructor of the class as the only parameter in order to create an
   *    instance from the supplied OCAPI document.
   * @param {string} [args.count] - The maximum count of result objects
   *    from the request.
   * @param {number} [args.db_start_record] - The record that was used as the
   *    beginning of the results list. This is specifically for paging.string
   * @param {string[]} [args.expand] - An optional expand array that defines
   *    what OCAPI expand parametersshould be included in the request.
   * @param {Query} args.query - The query to determine what results to return.
   * @param {string} args.select - The properties that should be returned by the
   *    query for the matching result objects. Use `(**)` to return all of
   *    the objects properties.
   */
  constructor(args) {
    if (args) {
      if (args.count) {
        this.count = args.count;
      }
    }
    this.dbStartRecord =
      args && args.db_start_record ? args.db_start_record : 0;
    this.expand =
      args && args.expand && Array.isArray(args.expand) ? args.expand : [];
    this.query = args && args.query ? args.query : null;
    this.select = args && args.select ? args.select : '';

    if (args && args.sorts) {
      this.sorts = args.sorts.map(_sort => new Sort(_sort));
    }
  }

  public getDocument(includeFields: string[] = []): Object {
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

    // Create a property on the results object.
    memberNames.forEach(localPropName => {
      const docPropName: string =
        typeof this.MEMBER_MAP[localPropName] !== 'undefined'
          ? this.MEMBER_MAP[localPropName]
          : localPropName;
      let localPropVal: any;

      if (typeof this[localPropName] !== 'undefined') {
        localPropVal = this[localPropName];
        const isComplexType =
          typeof localPropVal !== 'number' &&
          typeof localPropVal !== 'string' &&
          typeof localPropVal !== 'boolean';

        if (!isComplexType && localPropName !== 'count' && localPropName !== 'dbStartRecord') {
          documentObj[docPropName] = localPropVal;
        } else if (localPropName === 'query') {
          documentObj[docPropName] = localPropVal.getDocument();
        }
      }
    });

    return documentObj;
  }
}
