/**
 * @file OCAPIService.test.ts
 * @fileoverview - Provides unit testing of the OCAPIService.ts class.
 */
import * as assert from 'assert';

import { HTTP_VERB, ICallSetup } from '../../interfaces/ICallSetup';
import { IDWConfig } from '../../interfaces/IDWConfig';
import { OCAPIService } from '../OCAPIService';

// OCAPIService Test Suite
suite('OCAPIService Tests', () => {
  const ocapiService: OCAPIService = new OCAPIService();

  test('Test method for setup of the API Call:', () => {
    const callSetup: Promise<ICallSetup> = ocapiService.getCallSetup(
      'systemObjectDefinitions',
      'getAll',
      {
        count: 500,
        select: '(**)'
      }
    );
    const expectedSetup: Promise<ICallSetup> = new Promise((resolve, reject) => {
      resolve({
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
    });

    assert.deepEqual(callSetup, expectedSetup);
  });
});
