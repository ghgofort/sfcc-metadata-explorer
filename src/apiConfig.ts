/**
 * @file apiConfig.ts
 * @fileoverview - Exports an object literal with configuration information for
 *    the available OCAPI calls.
 */

import { window, workspace, WorkspaceConfiguration } from 'vscode';

/* ========================================================================
 * Configuration Helpers
 * ======================================================================== */

/**
 * @function getAPIVersion - Gets the configured API version from the VSCode
 *    configuration setting if configured or uses a default fallback if not.
 * @returns {string} - Returns the version string for use in an OCAPI document.
 */
export const getAPIVersion = () => {
  const DEFAULT = '20.4';
  // Get the workspace configuration object for all configuration settings
  // related to this extension.
  const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration(
    'extension.sfccmetadata'
  );

  const apiVersion: string = String(workspaceConfig.get('ocapi.version'));
  const tester = /^[\d]{2}\.[\d]$/;
  if (apiVersion && !tester.test(apiVersion)) {
    window.showErrorMessage('Value configured for OCAPI version in preference' +
      ' is not a valid value: ' + apiVersion + '. Using default version: ' +
      DEFAULT);
  }

  return apiVersion && tester.test(apiVersion) ? apiVersion : DEFAULT;
};

/**
 * @function getAPIVersionForPath - Gets the configured API version in the
 *    expected format for using in an OCAPI call URL.
 * @returns {string} - Returns the string version of the URL.
 */
export const getAPIVersionForPath = () => {
  return 'v' + getAPIVersion().replace('.', '_');
};

/**
 * Gets the configured clientId for the OCAPI calls from the VSCode setting, or
 * uses the default if none is set.
 * @return {string} - Returns the 30 character client Id configured for
 *    making calls to OCAPI.
 */
export const getClientId = () => {
  let clientId = apiConfig.clientId;
  const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration(
    'extension.sfccmetadata'
  );
  const configId = String(workspaceConfig.get('ocapi.clientid'));
  const tester = /^[\S]{30}$/;
  if (configId && !tester.test(configId)) {
    window.showErrorMessage('Value configured for OCAPI clientId is not valid: ' +
      configId + '. Using default version API client Id.');
  }

  return configId && tester.test(configId) ? configId : clientId;
};

/**
 * Gets the configured client password for the OCAPI calls from VSCode setting,
 * or uses the default if none is set.
 * @return {string} - Returns the 30 character client Id configured for
 *    making calls to OCAPI.
 */
export const getClientPass = () => {
  let defaultPass = apiConfig.clientId;
  const workspaceConfig: WorkspaceConfiguration = workspace.getConfiguration(
    'extension.sfccmetadata'
  );
  const configPass = String(workspaceConfig.get('ocapi.clientpassword'));
  const tester = /^[\S]{30}$/;
  if (configPass && !tester.test(configPass)) {
    window.showErrorMessage('Value configured for OCAPI client password is not valid: ' +
      configPass + '. Using default version API client Id.');
  }

  return configPass && tester.test(configPass) ? configPass : defaultPass;
};

/* ========================================================================
 * Exported API Configuration Object
 * ======================================================================== */

/**
 * @description - API configuration object for confguration of the OCAPI routes.
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
          path: 'custom_object_definitions/{objectType}/attribute_definitions'
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
     * Resource : Jobs
     **************************************************************************/
    jobs: {
      api: 'data',
      availableCalls: {
        /* ==================================================================
         * POST Execute Job
         * ================================================================== */
        executeJob: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          params: [
            {
              id: 'job_id',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path:
            'jobs/{job_id}/executions'
        },

        /* ==================================================================
         * GET Job Execution
         * ================================================================== */
        getExecution: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [
            {
              id: 'job_id',
              type: 'string',
              use: 'PATH_PARAMETER'
            },
            {
              id: 'execution_id',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path:
            'jobs/{job_id}/executions/{execution_id}'
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
         * GET SitePreference by Id
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
            'site_preferences/preference_groups/{groupId}/{instanceType}/preferences/{preferenceId}'
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
         * GET ALL SITES
         * ================================================================== */
        getAll: {
          authorization: 'BM_USER',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
          params: [],
          path: '/sites'
        },

        /* ==================================================================
         * PATCH Site Preferece value
         * ================================================================== */
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
         * GET OBJECT ATTRIBUTE DEFINITION
         * ================================================================== */
        getAttribute: {
          authorization: 'BM_USER',
          headers: {
            'Content-Type': 'application/json',
            'x-dw-validate-existing': true,
            Accept: 'application/json'
          },
          method: 'GET',
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
         * DELETE ATTRIBUTE GROUP
         * ================================================================== */
        deleteAttributeGroup: {
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
              id: 'count',
              type: 'number',
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
    }
  },

  /*
   * -- Target API Version ---
   * This should be the same as the version number for wich the client ID access
   * assigned in your sandboxes OCAPI Configuration and should be in the same
   * format as it is in an OCAPI URL (i.e.: v18_8).
   */
  version: getAPIVersionForPath()
};
