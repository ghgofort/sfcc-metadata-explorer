/**
 * @file apiConfig.ts
 * @fileoverview - Exports an object literal with configuration information for
 *    the available OCAPI calls.
 */

const PATH_PARAMETER: string = 'PATH_PARAMETER';

export const apiConfig = {

  resources: {

    /**
     * OCAPI : Data API
     * Resource : SystemObjectDefinitions
     */
    systemObjectDefinitions: {
      api: 'data',
      availableCalls: {
        // Gets the requested system object definition(s) based upon included
        // query parameters.
        get: {
          headers: {
            contentType: 'application/json'
          },
          method: 'GET',

          // Defines any required parameters to be validated against in the
          // callSetup() method of an OCAPIService class instance.
          params: [
            {
              id: 'objectType',
              type: 'string',
              use: PATH_PARAMETER
            }
          ]
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
