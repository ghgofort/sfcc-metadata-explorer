/**
 * @file ITreeData.ts
 * @fileoverview - Exports a namespace of custom interfaces for handling tree
 *    node data.
 */

 /**
  * @namespace ITreeData - A namespace exporting interfaces for helping with the
  *     various types of tree nodes that are required for the metadata explorer
  *     views.
  */
export namespace ITreeData {
  /**
   * @interface ICustomParentContainer - Parent container type node data for a
   *    CustomObjectDefinition OCAPI document.
   */
  export interface ICustomParentContainer {
    /**
     * @memberof ICustomParentContainer
     * @desc - Which parent container this belongs to (groups or attributes).
     */
    parentContainer: string;
    /**
     * @memberof ICustomParentContainer
     * @desc - The display name of the custom object definition used to query
     *    CustomObjectDefinition document from OCAPI to get the attribute &
     *    attribute grroup definitions.
     */
    objectDisplayName: string;
  }
};
