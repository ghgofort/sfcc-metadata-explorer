/**
 * @file apiConfig.ts
 * @fileoverview - Exports an object literal with configuration information for
 *    the available OCAPI calls.
 */

const PATH_PARAMETER: string = 'PATH_PARAMETER';

export const apiConfig: object = {
  resources: {
    systemObjectDefinitions: {
      getAll: {
        headers: {
          contentType: 'application/json'
        }
      },
      getObjectDefinition: {
        headers: {
          contentType: 'application/json'
        },
        params: [{
          id: 'objectType',
          type: 'string',
          use: PATH_PARAMETER
        }]
      }
    }
  }
};
