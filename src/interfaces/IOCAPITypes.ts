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
}