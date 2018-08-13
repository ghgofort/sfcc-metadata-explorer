/**
 * @file apiConfig.ts
 * @fileoverview - Exports an object literal with configuration information for
 *    the available OCAPI calls.
 */

export const apiConfig = {

  resources: {

    /**
     * OCAPI : Data API
     * Resource : SystemObjectDefinitions
     */
    systemObjectDefinitions: {
      api: 'data',
      availableCalls: {
        // Gets the list of system object definitions, filtered by any included
        // query parameters.
        get: {
          headers: {
            contentType: 'application/json'
          },
          method: 'GET',
          params: [
            {
              id: 'objectType',
              type: 'string',
              use: 'PATH_PARAMETER'
            }
          ],
          path: '/system_object_definitions/{objectType}'
        },

        // Get a list of the system object definitions filtered by the included
        // query parameters.
        getAll: {
          headers: {
            contentType: 'application/json'
          },
          method: 'GET',
          path: '/system_object_definitions'
        },
        //
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
