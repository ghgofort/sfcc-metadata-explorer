/**
 * @file IOCAPITypes.ts
 * @fileoverview - Exports the namespace IOCAPITypes which in turn exports
 * interfaces to handle some of the types that are commonly found within the
 * OCAPI document namespaces.
 */

import Query from '../documents/Query';

/**
 * @namespace IOCAPITypes - Types used in OCAPI request and response documents.
 */
export namespace IOCAPITypes {
  /** @interface ILocalizedString */
  export interface ILocalizedString {
    [index: string]: string;
    default: string;
  };

  /* ========================================================================
   * OCAPI Filter Document Types
   * ======================================================================== */

  /** @interface IFilter - OCAPI Data: Filter Document */
  export interface IFilter {
    term_filter?: ITermFilter;
    range_filter?: IRangeFilter;
    query_filter?: IQueryFilter;
    bool_filter?: IBoolFilter;
  };

  /** @interface ITermFilter - OCAPI Data Document: TermFilter */
  export interface ITermFilter {
    field: string;
    operator: TermOperatorType;
    values?: Object[];
  };

  /** @interface IRangeFilter - OCAPI Data Document: RangeFilter */
  export interface IRangeFilter {
    field: string;
    from?: Object;
    from_inclusive?: boolean;
    to?: Object;
    to_inclusive?: boolean;
  };

  /** @interface IRange2Filter - OCAPI Data Document: Range2Filter */
  export interface IRange2Filter {
    filter_mode?: FilterModeType;
    from_field: string;
    from_inclusive?: boolean;
    from_value?: Object;
    to_field: string;
    to_inclusive?: boolean;
    to_value?: Object;
  };

  /** @interface IQueryFilter - OCAPI Data Document: QueryFilter */
  export interface IQueryFilter {
    query: Query;
  };

  /** @interface IBoolFilter - OCAPI Data Document: BoolFilter */
  export interface IBoolFilter {
    filters?: IFilter[];
    operator: BoolFilterOperatorType;
  };

  /* ========================================================================
   * OCAPI Query Document types
   * ======================================================================== */

  /** @interface IQueryParams - Parameters for constructor of the Query class */
  export interface IQueryParams {
    boolean_query?: IBoolQuery;
    filtered_query?: IFilteredQuery;
    match_all_query?: IMatchAllQuery;
    term_query?: ITermQuery;
    text_query?: ITextQuery;
  };

  /** @interface IBoolQuery - OCAPI Data Document: BoolQuery */
  export interface IBoolQuery {
    must?: Query[];
    should?: Query[];
    must_not?: Query[];
  };

  /** @interface IFilteredQuery - OCAPI Data Document: FilteredQuery */
  export interface IFilteredQuery {
    filter: IFilter;
    query: Query;
  };

  /** @interface IMatchAllQuery - OCAPI Data Document: MatchAllQuery */
  export interface IMatchAllQuery { };

  /** @interface INestedQuery - OCAPI Data Document: NestedQuery */
  export interface INestedQuery {
    path: string;
    query: Query
  };

  /** @interface ITermQuery - OCAPI Data Document: TermQuery */
  export interface ITermQuery {
    fields: string[];
    operator: TermOperatorType;
    values?: Object[];
  };

  /** @interface ITextQuery - OCAPI Data Document: TextQuery */
  export interface ITextQuery {
    fields: string[];
    search_phrase: string;
  };

  /* ========================================================================
   * OCAPI Data Sort Document Types
   * ======================================================================== */

  /** @interface ISort - A sort parameter to sort results from an OCAPI query */
  export interface ISort {
    field: string;
    sortOrder: SortOrderType;
  };

  /* ========================================================================
   * Namespace Enum Objects
   * ======================================================================== */

  /** @enum {BoolFilterOperatorType} - OCAPI BoolFilter - operator field */
  export enum BoolFilterOperatorType { 'and', 'or', 'not' };

  /** @enum {FilterModeType} - OCAPI Range2Filter - filter_mode field */
  export enum FilterModeType {
    'overlap',
    'containing',
    'contained'
  };

  /** @enum {SortOrderType} - OCAPI Data Document: SortOrder */
  export enum SortOrderType {
    'asc',
    'desc'
  };

  /** @enum {TermOperatorType} - OCAPI TermFilter - operator field */
  export enum TermOperatorType {
    'is',
    'one_of',
    'is_null',
    'is_not_null',
    'less',
    'greater',
    'not_in',
    'neq'
  };
};
