/**
 * @file ConfigHelper.test.ts
 * @fileoverview - Provides unit testing of the ConfigHelper.ts class.
 */
import * as assert from 'assert';
import { IDWConfig } from '../../interfaces/IDWConfig';
import ConfigHelper from '../ConfigHelper';

// ConfigHelpers Test Suite
suite('ConfigHelpers Tests:', () => {
  test('Test of method to get available export options from apiConfig.ts: ', () => {
    var helper = new ConfigHelper();
    const expectedOptions = [
      {
        name: 'Catalog Static Resources',
        attribute: 'catalogStaticResources'
      }, {
        name: 'Catalogs',
        attribute: 'catalogs'
      }, {
        name: 'Customer Lists',
        attribute: 'customerLists'
      }, {
        name: 'Inventory Lists',
        attribute: 'inventoryLists'
      }, {
        name: 'Libraries',
        attribute: 'libraries'
      }, {
        name: 'Library Static Resources',
        attribute: 'libraryStaticResources'
      }, {
        name: 'Price Books',
        attribute: 'priceBooks'
      }, {
        name: 'Sites',
        attribute: 'sites'
      }
    ];
    const available: { name: string, attribute: string }[] = helper.getExportOptions();
    assert.deepEqual(available, expectedOptions);
  });
});