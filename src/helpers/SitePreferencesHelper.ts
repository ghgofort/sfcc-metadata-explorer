/**
 * @file SitePreferencesHelper.ts
 * @fileoverview - Exports a class with helper methods for handling API
 *    operations for Site Preferences related calls.
 */

import { MetadataNode } from '../components/MetadataNode';
import { OCAPIService } from '../services/OCAPIService';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import SitesHelper from './SitesHelper';
import { TreeItemCollapsibleState, window } from 'vscode';
import { SitePreferencesNode } from '../components/SitePreferencesNode';
import PreferenceValue from '../documents/PreferenceValue';

/**
 * @class
 * @classdesc - A class that includes helper functions for making calls to the
 *    Open Commerce API for Site Preference display in the tree view.
 */
export default class SitePreferencesHelper {
  private service: OCAPIService;
  private sitesHelper: SitesHelper = new SitesHelper();

  /**
   * @param {OCAPIService} service - The OCAPI service instance used to
   *    make calls to the SFCC instance.
   * @constructor
   */
  constructor(service: OCAPIService) {
    this.service = service;
  }

  /**
   * getAllPreferences
   */
  public async getAllPreferences(): Promise<MetadataNode[]> {
    let _callSetup = await this.service.getCallSetup(
      'systemObjectDefinitions',
      'getAttributeGroups',
      {
        select: '(**)',
        expand: 'definition',
        objectType: 'SitePreferences'
      }
    );

    let _callResult = await this.service.makeCall(_callSetup);

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
            parentId: 'sitePreferences',
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
            parentId: 'sitePreferences'
          }
        )
      ];
    }
  }

  public async getPreferencesInGroup(
    element: MetadataNode
  ): Promise<SitePreferencesNode[]> {
    const childNodes: SitePreferencesNode[] = [];
    const attrGroup = element.objectAttributeGroup;
    const hasAttributes = attrGroup.attributeDefinitionsCount > 0;

    // Attribute Definitions
    if (hasAttributes) {
      attrGroup.attributeDefinitions.forEach(attrDef => {
        var name = attrDef.id;
        var pref = new SitePreferencesNode(
          name,
          TreeItemCollapsibleState.Collapsed,
          {
            objectAttributeDefinition: attrDef,
            parentId: element.parentId + '.' + element.objectAttributeGroup.id
          }
        );
        childNodes.push(pref);
      });
    }

    return Promise.resolve(childNodes);
  }

  public async getSitePreferenceSites(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    let childNodes: MetadataNode[] = [];
    const groupId = element.parentId.split('.').pop();
    const prefId = element.objectAttributeDefinition.id;

    try {
      // Get the sites for the current SFCC server.
      let _callData = await this.service.getCallSetup(
        'sitePreferences',
        'getPreference', {
          groupId: groupId,
          instanceType: 'sandbox',
          preferenceId: prefId
      });

      let _callResult = await this.service.makeCall(_callData);

      if (!_callResult.error && _callResult.site_values) {
        var prefValue = new PreferenceValue(_callResult);
        if (prefValue.attributeDefinition &&
          prefValue.attributeDefinition.defaultValue
        ) {
          const defVal = prefValue.attributeDefinition.defaultValue;
          const dispDesc = defVal.displayValue.default ?
            defVal.id + ' : ' + defVal.displayValue.default : defVal.id;

            childNodes.push(new MetadataNode('Default Value:',
              TreeItemCollapsibleState.None,
              {
                displayDescription: dispDesc,
                parentId: element.parentId + '.' + defVal.id
              }
            ));
        }

        Object.keys(prefValue.siteValues).forEach(function(siteId) {
          childNodes.push(new MetadataNode(siteId,
            TreeItemCollapsibleState.None,
            {
              displayDescription: prefValue.siteValues[siteId],
              parentId: element.parentId + '.' + siteId
            }
          ));
        })
      } else if (!_callResult.error) {
        childNodes.push(new MetadataNode('No site values set.',
          TreeItemCollapsibleState.None,
          {
            displayDescription: ' -------  see console for response JSON.',
            parentId: element.parentId + '.' + 'NA'
          }
        ));

        console.log('OCAPI result: ', _callResult);
      } else {
        window.showErrorMessage('Unable to get preference values.');
        console.error('ERROR -- OCAPI call result: ', _callResult);
      }
    } catch (e) {
      window.showErrorMessage('ERROR calling OCAPI: ' + e.message);
    }

    return Promise.resolve(childNodes);
  }

  /**
   * Gets the details of a site preference for the specified site.
   */
  public async getSitePreference(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    let childNodes: MetadataNode[] = [];
    const parents = element.parentId.split('.');
    const siteId = parents.pop();
    const groupId = parents.pop();


    return childNodes;
  }
}
