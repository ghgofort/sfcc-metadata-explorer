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
  /** @interface ICustomerListLink */
  export interface ICustomerListLink {
    customer_list_id: string;
    link: string;
    title: ILocalizedString;
  }

  /** @interface ILocalizedString */
  export interface ILocalizedString {
    [index: string]: string;
    default: string;
  }

  /** @interface IJobExecutionParameter */
  export interface IJobExecutionParameter {
    name: string;
    value: string;
  }

  /** @interface IStatus */
  export interface IStatus {
    code: string;
    message: string;
    status: 'ok'|'error';
  }
}
