/**
 * @file apiConfig.ts
 * @fileoverview - Exports an object literal with configuration information for
 *    the available OCAPI calls.
 */

export const apiConfig = {
  clientId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  clientPassword: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  resources: {
    /***************************************************************************
     * OCAPI : Data API
     * Resource : CustomObjectDefinitions
     **************************************************************************/
    customObjectDefinitions: {
      api: 'data',
      availableCalls: {
        /* ==================================================================
         * GET ALL CUSTOM OBJECT DEFINITIONS
         * ================================================================== */
        getAll: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [
            {
              id: 'select',
              type: 'string',
              use: 'QUERY_PARAMETER'
            },
            {
              id: 'count',
              type: 'number',
              use: 'QUERY_PARAMETER'
            }
          ],
          // Use the system_object_definition endpoint with the filter to only
          // get the custom object tyeps.
          path: 'system_object_definitions'
        },

        /* ==================================================================
         * GET A CUSTOM OBJECT DEFINITION & ATTRIBUTES
         * ================================================================== */
        get: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path: '/custom_object_definitions/{objectType}/attribute_definitions'
        },

        /* ==================================================================
         * GET CUSTOM OBJECT ATTRIBUTES
         * ================================================================== */
        getAttributes: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [
            {
              id: 'select',
              type: 'string',
              use: 'QUERY_PARAMETER'
            },
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path: 'custom_object_definitions/{objectType}/attribute_definitions'
        }
      }
    },

    /***************************************************************************
     * OCAPI : Data API
     * Resource : SystemObjectDefinitions
     **************************************************************************/
    systemObjectDefinitions: {
      api: 'data',
      availableCalls: {
        /* ==================================================================
         * GET SYSTEM OBJECT DEFINITION & ATTRIBUTES
         * ================================================================== */
        get: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path: 'system_object_definitions/{objectType}'
        },

        /* ==================================================================
         * GET ALL SYSTEM OBJECT DEFINITIONS
         * ================================================================== */
        getAll: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [
            {
              id: 'select',
              type: 'string',
              use: 'QUERY_PARAMETER'
            },
            {
              id: 'count',
              type: 'number',
              use: 'QUERY_PARAMETER'
            }
          ],
          path: 'system_object_definitions'
        },

        /* ==================================================================
         * GET SYSTEM OBJECT ATTRIBUTES
         * ================================================================== */
        getAttributes: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [
            {
              id: 'select',
              type: 'string',
              use: 'QUERY_PARAMETER'
            },
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path: 'system_object_definitions/{objectType}/attribute_definitions'
        },

        /* ==================================================================
         * CREATE NEW ATTRIBUTE DEFINITION
         * ================================================================== */
        createAttribute: {
          authorization: 'BM_USER',
          headers: {
            'Content-Type': 'application/json',
            'x-dw-validate-existing': true,
            Accept: 'application/json'
          },
          method: 'PUT',
          params: [
            {
              id: 'id',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path:
            'system_object_definitions/{objectType}/attribute_definitions/{id}'
        },

        /* ==================================================================
         * DELETE ATTRIBUTE DEFINITION
         * ================================================================== */
        deleteAttribute: {
          authorization: 'BM_USER',
          headers: {
            'Content-Type': 'application/json',
            'x-dw-validate-existing': true,
            Accept: 'application/json'
          },
          method: 'DELETE',
          params: [
            {
              id: 'id',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path:
            'system_object_definitions/{objectType}/attribute_definitions/{id}'
        },

        /* ==================================================================
         * CREATE ATTRIBUTE GROUP
         * ================================================================== */
        createAttributeGroup: {
          authorization: 'BM_USER',
          headers: {
            'Content-Type': 'application/json',
            'x-dw-validate-existing': true,
            Accept: 'application/json'
          },
          method: 'PUT',
          params: [
            {
              id: 'id',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path: 'system_object_definitions/{objectType}/attribute_groups/{id}'
        },

        /* ==================================================================
         * GET ATTRIBUTE GROUPS
         * ================================================================== */
        getAttributeGroups: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [
            {
              id: 'select',
              type: 'string',
              use: 'QUERY_PARAMETER'
            },
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path: 'system_object_definitions/{objectType}/attribute_groups'
        },

        /* ==================================================================
         * ADD ATTRIBUTE DEFINITION TO ATTRIBUTE GROUP
         * ================================================================== */
        assignAttributeToGroup: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
          params: [
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'groupId',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'attributeId',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path:
            'system_object_definitions/{objectType}/attribute_groups/{groupId}/attribute_definitions/{attributeId}'
        },

        /* ==================================================================
         * REMOVE ATTRIBUTE DEFINITION FROM ATTRIBUTE GROUP
         * ================================================================== */
        removeAttributeFromGroup: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'DELETE',
          params: [
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'groupId',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'attributeId',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path:
            'system_object_definitions/{objectType}/attribute_groups/{groupId}/attribute_definitions/{attributeId}'
        }
      }
    },

    /***************************************************************************
     * OCAPI : Data API
     * Resource : SitePreferences
     **************************************************************************/
    sitePreferences: {
      api: 'data',
      availableCalls: {
        /* ==================================================================
         * GET SYSTEM OBJECT DEFINITION & ATTRIBUTES
         * ================================================================== */
        getPreference: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [
            {
              id: 'groupId',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'instanceType',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'preferenceId',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path:
            '/site_preferences/preference_groups/{groupId}/{instanceType}/preferences/{preferenceId}'
        }
      }
    },

    /***************************************************************************
     * OCAPI : Data API
     * Resource : Sites
     **************************************************************************/
    sites: {
      api: 'data',
      availableCalls: {
        /* ==================================================================
         * GET all sites.
         * ================================================================== */
        getAll: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [],
          path: '/sites'
        },
        setPrefValue: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'PATCH',
          params: [
            {
              id: 'site_id',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'instance_type',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'group_id',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path:
            'sites/{site_id}/site_preferences/preference_groups/{group_id}/{instance_type}'
        }
      }
    }
  },

  /*
   * -- Target API Version ---
   * This should be the same as the version number for wich the client ID access
   * assigned in your sandboxes OCAPI Configuration and should be in the same
   * format as it is in an OCAPI URL (i.e.: v18_8).
   */
  version: 'v18_8'
};
