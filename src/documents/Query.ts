/**
 * @file Query.ts
 * @fileoverview - Exports a single OCAPI document class for a Query.
 */

import { apiConfig } from '../apiConfig';
import IAPIDocument from '../interfaces/IAPIDocument';
import { IOCAPITypes } from '../interfaces/IOCAPITypes';

/**
 * @class Query
 * @classdesc - A document class for the OCAPI data API document: Query.
 */
export default class Query implements IAPIDocument {
  // Public Class members
  public boolQuery?: IOCAPITypes.IBoolQuery;
  public fileteredQuery?: IOCAPITypes.IFilteredQuery;
  public matchAllQuery?: IOCAPITypes.IMatchAllQuery;
  public termQuery?: IOCAPITypes.ITermQuery;
  public textQuery?: IOCAPITypes.ITextQuery;

  /**
   * @description - A list of field Ids that can be set to include only
   *    properties that need to be set when sending the document definition in
   *    an Open Commerce API call.*/
  public includedFields: string[] = [];

  /**
   * @constant MEMBER_MAP - Maps any local property names to their OCAPI
   *    document equivalent property name.
   * */
  public readonly MEMBER_MAP = {
    boolQuery: 'boolean_query',
    filteredQuery: 'filtered_query',
    matchAllQuery: 'match_all_query',
    termQuery: 'term_query',
    textQuery: 'text_query'
  };

  /**
   * @constructor
   * @param {IOCAPITypes.IQueryParams} [queryParams] - An arguments object that
   *  contains one of the defined query types (optional).
   */
  constructor(queryParams?: IOCAPITypes.IQueryParams) {
    if (queryParams) {
      if (queryParams.boolean_query) {
        this.boolQuery = queryParams.boolean_query;
      } else if (queryParams.filtered_query) {
        this.fileteredQuery = queryParams.filtered_query;
      } else if (queryParams.match_all_query) {
        this.matchAllQuery = queryParams.match_all_query;
      } else if (queryParams.term_query) {
        this.termQuery = queryParams.term_query;
      } else if (queryParams.text_query) {
        this.textQuery = queryParams.text_query;
      }
    }
  }

  /**
   * Gets the JS Object literal in the format of the OCAPI document defintion
   * which can be used to make calls to OCAPI.
   *
   * @param {string[]} [includeFields = []] - An optional argument to specify
   *    class properties to include in the JSON string result. If empty, all of
   *    the class properties will be included. This is not ideal when updating
   *    because it will overwrite values for attribute properties that were
   *    previously set with the class defaults. In this case, specify only the
   *    fields that you are updating.
   * @return {Object} - Returns the JS object definition for using the Query
   *    document in a call to the Open Commerce API.
   */
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
        localPropName in this.MEMBER_MAP
          ? this.MEMBER_MAP[localPropName]
          : localPropName;
      let localPropVal: any;

      if (typeof this[localPropName] !== 'undefined') {
        localPropVal = this[localPropName];
        const isComplexType =
          typeof localPropVal !== 'number' &&
          typeof localPropVal !== 'string' &&
          typeof localPropVal !== 'boolean';

        if (!isComplexType || [
            'boolQuery',
            'filteredQuery',
            'matchAllQuery',
            'termQuery',
            'textQuery'
          ].indexOf(localPropName) > -1
        ) {
          documentObj[docPropName] = localPropVal;
        }
      }
    });

    return documentObj;
  }
}
