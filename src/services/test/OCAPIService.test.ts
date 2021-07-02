/**
 * @file OCAPIService.test.ts
 * @fileoverview - Provides unit testing of the OCAPIService.ts class.
 */
import * as assert from 'assert';

import { HTTP_VERB, ICallSetup } from '../ICallSetup';
import { OCAPIService } from '../OCAPIService';

// OCAPIService Test Suite
suite('OCAPIService Tests', () => {
  const ocapiService: OCAPIService = new OCAPIService();

  suiteSetup(() => {
    /** @todo: Setup any suite wide setup that is necessary; */
  });

  test('Setup GET call for all SystemObjectDefinitions', () => {
    const callSetup: Promise<ICallSetup> = ocapiService.getCallSetup(
      'systemObjectDefinitions',
      'getAll',
      {
        count: 500,
        select: '(**)'
      }
    );
    const expectedSetup: Promise<ICallSetup> = Promise.resolve({
      body: {},
      callName: '',
      endpoint: 'v20_4/',
      headers: {
        'Content-Type': 'application/json'
      },
      method: HTTP_VERB.get,
      setupErrMsg: '',
      setupError: false
    });

    assert.deepEqual(callSetup, expectedSetup);
  });
});
