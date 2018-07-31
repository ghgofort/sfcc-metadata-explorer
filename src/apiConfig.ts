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
      availableCalls: {
        // Gets the requested system object definition(s) based upon included
        // query parameters.
        get: {
          headers: {
            contentType: 'application/json'
          },

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
  }
};
