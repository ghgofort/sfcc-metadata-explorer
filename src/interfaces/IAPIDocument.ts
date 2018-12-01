/**
 * @file IAPIDocument.ts
 * @fileoverview - Exports an interface that each document class implments in
 * order to provide a consistent set of methods to call when dealing with
 * different types of OCAPI documents.
 */

/**
 * @interface IGetDocument
 */
interface IGetDocument {
  (): Object
};

/**
 * @interface IAPIDocument
 */
export default interface IAPIDocument {
  // Member Variables
  includedFields: string[];
  readonly MEMBER_MAP: Object;

  // Member Functions
  getDocument: IGetDocument;
}