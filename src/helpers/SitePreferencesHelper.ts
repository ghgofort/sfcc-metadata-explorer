/**
 * @file SitePreferencesHelper.ts
 * @fileoverview - Exports a class with helper methods for handling API
 *    operations for Site Preferences related calls.
 */

import { TreeItemCollapsibleState, window } from 'vscode';
import { MetadataNode } from '../components/MetadataNode';
import { SitePreferencesNode } from '../components/SitePreferencesNode';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import PreferenceValue from '../documents/PreferenceValue';
import { OCAPIService } from '../services/OCAPIService';
import SitesHelper from './SitesHelper';

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
    const _callSetup = await this.service.getCallSetup(
      'systemObjectDefinitions',
      'getAttributeGroups',
      {
        count: 150,
        select: '(**)',
        expand: 'definition',
        objectType: 'SitePreferences'
      }
    );

    const _callResult = await this.service.makeCall(_callSetup);

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
        const name = attrDef.id;
        const pref = new SitePreferencesNode(
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
    const childNodes: MetadataNode[] = [];
    const groupId = element.parentId.split('.').pop();
    const prefId = element.objectAttributeDefinition.id;
    const prefType = element.objectAttributeDefinition.valueType;

    try {
      // Get the sites for the current SFCC server.
      const _callData = await this.service.getCallSetup(
        'sitePreferences',
        'getPreference', {
          groupId,
          instanceType: 'sandbox',
          preferenceId: prefId
      });

      const callResult = await this.service.makeCall(_callData);
      const sites = await this.sitesHelper.getAllSites();

      if (!callResult.error) {
        const prefValue = new PreferenceValue(callResult);

        // Add a default value tree node.
        if (prefValue.attributeDefinition &&
          prefValue.attributeDefinition.defaultValue
        ) {
          // Use default value from attribute definition.
          const defVal = prefValue.attributeDefinition.defaultValue;
          const dispDesc = typeof defVal.displayValue !== 'undefined' &&
            defVal.displayValue.default ?
            defVal.id + ' : ' + defVal.displayValue.default : defVal.id;

          childNodes.push(new MetadataNode('Default Value:',
              TreeItemCollapsibleState.None,
              {
                displayDescription: dispDesc,
                parentId: element.parentId + '.' + defVal.id
              }
            ));
        } else {
          // No default value set.
          childNodes.push(new MetadataNode('Default Value: ',
            TreeItemCollapsibleState.None,
            {
              displayDescription: 'No default set',
              parentId: element.parentId + '.' + prefValue.id
            }
          ));
        }

        if (sites && sites.count && sites.data && sites.data.length) {

          sites.data.forEach(site => {
            const siteVal = prefValue.siteValues &&
              typeof prefValue.siteValues[site.id] !== 'undefined' ?
              prefValue.siteValues[site.id] : 'No value set';
            childNodes.push(new MetadataNode(site.id,
              TreeItemCollapsibleState.None,
              {
                displayDescription: String(siteVal),
                parentId: element.parentId + '.' + site.id,
                preferenceValue: {
                  id: prefId,
                  type: prefType,
                  objectAttributeDefinition: element.objectAttributeDefinition
                }
              }
            ));
          });
        }
        Object.keys(prefValue.siteValues).forEach(siteId => {
        });
      } else if (!callResult.error) {
        childNodes.push(new MetadataNode('No site values set.',
          TreeItemCollapsibleState.None,
          {
            displayDescription: ' -------  see console for response JSON.',
            parentId: element.parentId + '.' + 'NA'
          }
        ));

        console.log('OCAPI result: ', callResult);
      } else {
        window.showErrorMessage('Unable to get preference values.');
        console.error('ERROR -- OCAPI call result: ', callResult);
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
    const childNodes: MetadataNode[] = [];
    const parents = element.parentId.split('.');
    const siteId = parents.pop();
    const groupId = parents.pop();

    return childNodes;
  }

  /**
   * Sets the value of a site preference attribute by getting the value from the
   * user and sending to OCAPI to set.
   * @param {MetadataNode} element - The element currently selected when the
   *    context menu action was invoked.
   */
  public async setPreferenceValue(
    element: MetadataNode
  ): Promise<MetadataNode[]> {
    const childNodes: MetadataNode[] = [];

    return Promise.resolve(childNodes);
  }
}
