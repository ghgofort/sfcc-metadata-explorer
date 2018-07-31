/**
 * @file OCAPIService.test.ts
 * @fileoverview - Provides unit testing of the OCAPIService.ts class.
 */
import * as assert from 'assert';

import { HTTP_VERB, ICallSetup } from '../ICallSetup';
import OCAPIService from '../OCAPIService';

// OCAPIService Test Suite
suite('OCAPIService Tests', () => {
  const ocapiService: OCAPIService = new OCAPIService();

  suiteSetup(() => {
    /** @todo: Setup any suite wide setup that is necessary; */
  });

  test('Setup GET call for all SystemObjectDefinitions', () => {
    const callSetup: ICallSetup = ocapiService.getCallSetup('system_object_definitions', 'get', {});
    const expectedSetup: ICallSetup = {
      body: {},
      callName: '',
      endpoint: '',
      headers: {
        contentType: 'application/json'
      },
      method: HTTP_VERB.get,
      setupErrMsg: '',
      setupError: false
    };

    assert.deepEqual(callSetup, expectedSetup);
  });
});
