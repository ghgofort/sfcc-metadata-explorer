/**
 * @file IOCAPITypes.ts
 * @fileoverview - Exports the namespace IOCAPITypes which in turn exports
 * interfaces to handle some of the types that are commonly found within the
 * OCAPI document namespaces.
 */

/**
 * @namespace IOCAPITypes - Types used in OCAPI request and response documents.
 */
export namespace IOCAPITypes {
  /** @interface ILocalizedString */
  export interface ILocalizedString {
    [index: string]: string;
    default: string;
  }

  /** @interface IMatchAllQuery - Represents a MatchAllQuery OCAPI document. */
  export interface IMatchAllQuery {

  }

  /** @interface ISort - A sort parameter to sort results from an OCAPI query */
  export interface ISort {
    field: string;
    sortOrder: SortOrderType;
  }

  /* ========================================================================
   * Namespace Enum Objects
   * ======================================================================== */

   /** @enum {SortOrderType} */
  export enum SortOrderType {
    'asc',
    'desc'
  };
}