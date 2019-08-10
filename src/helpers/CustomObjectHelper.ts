/**
 * @file CustomObjectHelper.ts
 * @fileoverview - Exports a single class that can be used to help with OCAPI
 *    call operations for managing custom object definitions.
 */

import { apiConfig } from '../apiConfig';
import { MetadataNode } from '../components/MetadataNode';
import { OCAPIService } from '../services/OCAPIService';
import { ICallSetup } from '../services/ICallSetup';
import { TreeItemCollapsibleState } from 'vscode';
import Query from '../documents/Query';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import { SearchRequest } from '../documents/SearchRequest';

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
          search_phrase: parentNode.customParentContainer.objectDisplayName
        }
      });

      var searchRequest = new SearchRequest({
        query: query,
        select: '(**)'
      });

      // Look up the Object definition to get the ID for fetching the
      // CustomObjectDefinition attributes.
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitionSearch',
        'search',
        {body: searchRequest.getDocument()}
      );

      _callResult = await this.service.makeCall(_callSetup);
      console.log(_callResult);

      // There should only be 1 object returned.
      if (
        !_callResult.error &&
        typeof _callResult.data !== 'undefined' &&
        Array.isArray(_callResult.data)
      ) {
        console.log(_callResult.data);
        const obj = new ObjectTypeDefinition(_callResult.hits[0]);
        return obj.objectType;
      }
    } catch (e) {
      let errMsg = 'Error in CustomeObjectHelpers.getCustomObjectId() method:';
      errMsg += Object.keys(e).map(function (key) {
        return '\n\t' + key + ': ' + [key];
      }).join();
      throw new Error(errMsg);
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
    const path = element.parentId.split('.');
    const objectType = path.pop();
    const parentType = path.pop();
    let _callSetup: ICallSetup = null;
    let _callResult: any;

    try {
      const custObjType = await this.getCustomObjectId(element);

      if (custObjType) {
        _callSetup = await this.service.getCallSetup(
          parentType,
          'getAttributes',
          {
            select: '(**)',
            count: 500,
            objectType: objectType
          }
        );
      } else {
        throw new Error('There was an error getting the custom object Id.');
      }

      _callResult = await this.service.makeCall(_callSetup);
    } catch (e) {
      throw new Error(e.toString());
    }

    // If the API call returns data create the first level of a tree.
    if (
      !_callResult.error &&
      typeof _callResult.data !== 'undefined' &&
      Array.isArray(_callResult.data)
    ) {
      return _callResult.data.map(resultObj => {
        return new MetadataNode(
          resultObj.id,
          TreeItemCollapsibleState.Collapsed,
          {
            parentId: element.parentId + '.' + objectType,
            objectAttributeDefinition: new ObjectAttributeDefinition(resultObj),
            displayDescription: resultObj.display_name
              ? resultObj.display_name.default
              : ''
          }
        );
      });
    }

    // If there is an error display a single node indicating that there
    // was a failure to load the object definitions.
    return [
      new MetadataNode('Unable to load...', TreeItemCollapsibleState.None, {
        parentId: 'root.systemObjectDefinitions.' + objectType
      })
    ];
  }

  /**
   * Gets the object attribute groups defined for the custom object.
   * @param {MetadataNode} element - The MetadataNode instance.
   * @return {Promise<MetadataNode[]>}
   */
  private async getObjectAttributeGroups(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    let _callSetup: ICallSetup = null;
    let _callResult: any;

    const objectType = await this.getCustomObjectId(element);

    // Make the call to the OCAPI Service to get the attribute groups.
    // Tree branch for attribute groups.
    _callSetup = await this.service.getCallSetup(
      'customObjectDefinitions',
      'getAttributeGroups',
      {
        select: '(**)',
        expand: 'definition',
        objectType: objectType
      }
    );

    _callResult = await this.service.makeCall(_callSetup);
    console.log(_callResult);

    // If the API call returns data create the first level of a tree.
    if (
      !_callResult.error &&
      typeof _callResult.data !== 'undefined' &&
      Array.isArray(_callResult.data)
    ) {
      return _callResult.data.map(resultObj => {
        return new MetadataNode(
          resultObj.id,
          TreeItemCollapsibleState.Collapsed,
          {
            parentId: element.parentId + '.' + objectType,
            objectAttributeGroup: new ObjectAttributeGroup(resultObj),
            displayDescription: resultObj.display_name
              ? resultObj.display_name.default
              : ''
          }
        );
      });
    } else if (
      !_callResult.error &&
      typeof _callResult.count !== 'undefined' &&
      _callResult.count === 0
    ) {
      // If there are no attribute groups defined then create a single node
      // with a message for the user.
      return [
        new MetadataNode(
          'No attribute groups defined',
          TreeItemCollapsibleState.None,
          {
            parentId: element.parentId + '.' + objectType
          }
        )
      ];
    }

    // If there is an error display a single node indicating that there
    // was a failure to load the object definitions.
    return [
      new MetadataNode('Unable to load...', TreeItemCollapsibleState.None, {
        parentId: element.parentId + '.' + objectType
      })
    ];
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
    return element.name !== 'Attribute Groups'
      ? this.getObjectAttributes(element)
      : this.getObjectAttributeGroups(element);
  }
}
