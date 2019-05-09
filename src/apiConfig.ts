/**
 * @file apiConfig.ts
 * @fileoverview - Exports an object literal with configuration information for
 *    the available OCAPI calls.
 *
 *  _NOTES:_
 *  - Supported values for `params.use`:
 *    * PATH_PARAMETER
 *    * QUERY_PARAMETER
 *  - If the `params.use` field is left empty, the data will be added to the
 *    body of the request for PUT, POST, & DELETE requests, and as HTTP query
 *    parameters for GET requests.
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
            }, {
              id: 'count',
              type: 'number',
              use: 'QUERY_PARAMETER'
            }
          ],
          // Use the system_object_definition endpoint with the filter to only
          // get the custom object tyeps.
          path: 'system_object_definitions',
        }
      }
    },

    /***************************************************************************
     * OCAPI : Shop API
     * Resource : OrderSearch
     **************************************************************************/
    orderSearch: {
      /** @todo: Implement Order Search */
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
            }, {
              id: 'count',
              type: 'number',
              use: 'QUERY_PARAMETER'
            }
          ],
          path: 'system_object_definitions',
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
            },{
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
            'Accept': 'application/json'
          },
          method: 'PUT',
          params: [
            {
              id: 'id',
              type: 'string',
              use: 'PATH_PARAMETER'
            },{
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }

          ],
          path: 'system_object_definitions/{objectType}/attribute_definitions/{id}'
        },

        /* ==================================================================
         * DELETE ATTRIBUTE DEFINITION
         * ================================================================== */
        deleteAttribute: {
          authorization: 'BM_USER',
          headers: {
            'Content-Type': 'application/json',
            'x-dw-validate-existing': true,
            'Accept': 'application/json'
          },
          method: 'DELETE',
          params: [
            {
              id: 'id',
              type: 'string',
              use: 'PATH_PARAMETER'
            },{
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }

          ],
          path: 'system_object_definitions/{objectType}/attribute_definitions/{id}'
        },

        /* ==================================================================
         * CREATE ATTRIBUTE GROUP
         * ================================================================== */
        createAttributeGroup: {
          authorization: 'BM_USER',
          headers: {
            'Content-Type': 'application/json',
            'x-dw-validate-existing': true,
            'Accept': 'application/json'
          },
          method: 'PUT',
          params: [
            {
              id: 'id',
              type: 'string',
              use: 'PATH_PARAMETER'
            },{
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
            },{
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
            }, {
              id: 'groupId',
              type: 'string',
              use: 'PATH_PARAMETER'
            }, {
              id: 'attributeId',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path: 'system_object_definitions/{objectType}/attribute_groups/{groupId}/attribute_definitions/{attributeId}'
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
            }, {
              id: 'groupId',
              type: 'string',
              use: 'PATH_PARAMETER'
            }, {
              id: 'attributeId',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path: 'system_object_definitions/{objectType}/attribute_groups/{groupId}/attribute_definitions/{attributeId}'
        }
      }
    },

    /*************************************************************************
    * OCAPI : Data API
    * Resource : SystemObjectDefinitionSearch
    **************************************************************************/
    systemObjectDefinitionSearch: {
      api: 'data',
      availableCalls: {
        /* ==================================================================
        * SEARCH FOR SYSTEM OBJECT DEFINITIONS
        * ================================================================== */
        search: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          params: [],
          path: 'system_object_definition_search'
        },
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
