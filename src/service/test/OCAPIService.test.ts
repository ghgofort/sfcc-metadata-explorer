/**
 * @file OCAPIService.test.ts
 * @fileoverview - Provides unit testing of the OCAPIService.ts class.
 */
import * as assert from 'assert';

import { CallSetup } from '../CallSetup';
import { OCAPIService } from '../OCAPIService';


// OCAPIService Test Suite
suite('OCAPIService Tests', () => {
  const ocapiService: OCAPIService = new OCAPIService();

  suiteSetup(() => {
    /** @todo: Setup any suite wide setup that is necessary; */
  });

  test('Setup GET call for all SystemObjectDefinitions', () => {
    const callSetup: CallSetup = ocapiService.getCallSetup('system_object_definitions');
    const expectedSetup: CallSetup = new CallSetup();
    assert.deepEqual(callSetup, expectedSetup);
  });
});
