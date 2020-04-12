/**
 * @file IAPIDocument.ts
 * @fileoverview - Exports an interface that each document class implments in
 * order to provide a consistent set of methods to call when dealing with
 * different types of OCAPI documents.
 */

/**
 * @type IGetDocument
 */
type IGetDocument = () => object;

/**
 * @interface IAPIDocument
 */
export default interface IAPIDocument {
  // Member Variables
  includedFields: string[];
  readonly MEMBER_MAP: object;

  // Member Functions
  getDocument: IGetDocument;
}
