/**
 * @file CustomObjectHelper.ts
 * @fileoverview - Exports a single class that can be used to help with OCAPI
 *    call operations for managing custom object definitions.
 */

import { MetadataNode } from '../components/MetadataNode';
import { OCAPIService } from '../services/OCAPIService';
import { ICallSetup } from '../services/ICallSetup';
import Query from '../documents/Query';

export default class CustomObjectHelper {
  private service: OCAPIService;

  /**
   * @constructor
   * @param {OCAPIService} service - The service instance used to make calls to
   *    the Open Commerce API.
   */
  constructor(service: OCAPIService) {
    this.service = service;
  }

  private async getCustomObjectId(parentNode: MetadataNode): Promise<string> {
    let _callSetup: ICallSetup = null;
    let _callResult: any;
    try {
      var query = new Query({
        text_query: {
          fields: ['display_name'],
          search_phrase: ''
        }
      });

      // Look up the Object definition to get the ID for looking up the
      // CustomObjectDefinition.
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitionSearch',
        'search',
        { body: query.getDocument(), select: '(**)' }
      );

      _callResult = await this.service.makeCall(_callSetup);
    } catch (e) {
      throw new Error(e.toString());
    }
  }

  /**
   * Gets the attributes of a a custom object definition from OCAPI.
   *
   * @param {MetadataNode} element - The MetadataNode instance for the custom
   *    object type.
   * @return {Promise<MetadataNode[]>} - Returns the child Metadata nodes to
   *    render as child nodes of the object attributes node.
   */
  private async getObjectAttributes(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
      /** @todo */
  }

  /**
   * Gets the children elements of System & Custom object type nodes.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getObjectAttributeGroups(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    /** @todo */
  }

  /**
   * Publicly accessible method for getting the attribute definitions & groups
   * for a custom object defined as a MetadataNode type.
   *
   * @param {MetadataNode} element - The metadata tree node representing the
   *    SFCC custom object definition.
   * @return {Promise<MetadataNode[]>} - Returns the children nodes for either
   *    the custom object attributes container, or the custom object attribute
   *    groups container.
   */
  public async getCustomContainerChildren(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    return element.name !== 'Attribute Groups' ?
      this.getObjectAttributes(element) :
      this.getObjectAttributeGroups(element);
  }
}
