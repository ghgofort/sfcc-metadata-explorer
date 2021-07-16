import {
  CancellationToken,
  CancellationTokenSource,
  InputBoxOptions,
  QuickPickOptions,
  window
} from 'vscode';
import { MetadataNode } from '../components/MetadataNode';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import { IOCAPITypes } from '../interfaces/IOCAPITypes';
import { OCAPIService } from '../services/OCAPIService';
import OCAPIHelper from './OCAPIHelper';
import SitePreferencesHelper from './SitePreferencesHelper';

/**
 * @class
 * @classdesc - A helper class for handling command actions that are separate
 *    from the view provider functionality.
 */
export default class CommandHelper {
  private ocapiHelper: OCAPIHelper;
  private service: OCAPIService;
  private prefsHelper: SitePreferencesHelper;

  constructor() {
    this.service = new OCAPIService();
    this.prefsHelper = new SitePreferencesHelper(this.service);
    this.ocapiHelper = new OCAPIHelper();
  }

  /* ========================================================================
   * Validator Functions
   * ======================================================================== */

  /**
   * @description - Validates that a string is an allowed value.
   * @param {string} input - The user input string to validate.
   * @returns {string|null} - Returns an error message if the reuslt was not
   *    valid, OR returns null if the result was valid.
   */
  private validateString(input: string): string|null {
    /** @todo: Lookup type requirements for 'string' type attributes. */
    return null;
  }

  /* ========================================================================
   * Get User Input Functions
   * ======================================================================== */

  /**
   * @description- Gets a boolean value from a user.
   * @return {Promise<boolean>} - Returns a promise that resolves to a boolean
   *    value selected by the user.
   */
  private async getBooleanValue(): Promise<boolean> {
    // Create a cancelation token instance to cancel the request when needed.
    const tokenSource: CancellationTokenSource = new CancellationTokenSource();
    const cancelBoolToken: CancellationToken = tokenSource.token;
    const boolInputBoxOptions: QuickPickOptions = {
      placeHolder: 'Select value'
    };
    let value = true;

    try {
      const selectedValue = await window.showQuickPick(
        ['true', 'false'],
        boolInputBoxOptions,
        cancelBoolToken
      );

      value = selectedValue === 'true';
    } catch (e) {
      window.showErrorMessage('Unable to get boolean value');
      console.log(e);
    }

    return Promise.resolve(value);
  }

  /**
   * @description- Gets the Int type value from the list of configured value
   *    options from the user.
   * @return {Promise<number>} - Returns a promise that resolves to the enum
   *    value that the user selected to set the preference value to.
   */
  private async getEnumValue(element: MetadataNode): Promise<number|string> {
    // Create a cancelation token instance to cancel the request when needed.
    const tokenSource: CancellationTokenSource = new CancellationTokenSource();
    const cancelBoolToken: CancellationToken = tokenSource.token;
    const intSelectOptions: QuickPickOptions = {
      placeHolder: 'Select value'
    };

    try {
      const displayValues: string[] = [];
      const valueOptions: IOCAPITypes.IDocumentObject = {};

      // Get the expanded attribute with the values.
      let attrDef = element.preferenceValue ? element.preferenceValue.objectAttributeDefinition : null;
      // Call OCAPI to get the value definitions of the attribute.
      const attrAPIObj = await this.ocapiHelper.getExpandedAttribute(element);

      if (attrAPIObj) {
        attrDef = new ObjectAttributeDefinition(attrAPIObj);
      } else {
        throw new Error('Failed call to OCAPI to get attribute values.');
      }

      if (attrDef &&
        attrDef.valueDefinitions &&
        attrDef.valueDefinitions.length
      ) {
        // Create a map object for value => displayValue.
        attrDef.valueDefinitions.forEach(attrVal => {
          valueOptions[attrVal.displayValue.default] = attrVal.value;
          // Keep an array of display values for choices.
          displayValues.push(attrVal.displayValue.default);
        });
      } else {
        // If no attribute values show a warning message & return.
        window.showWarningMessage('No values configured for ' +
          attrDef.valueType + ' attribute type');
        return Promise.reject('No values configured for enum type.');
      }

      // Show user quick-pick to select one of the configured enum values.
      const selectedValue = await window.showQuickPick(
        displayValues,
        intSelectOptions,
        cancelBoolToken
      ) || '';

      return valueOptions[selectedValue] ? Promise.resolve(valueOptions[selectedValue]) :
        Promise.reject('Unable to set attribute value.');
    } catch (e) {
      window.showErrorMessage('There was an error setting attribute value.');
      console.log(e);
    }

    return Promise.reject('Action canceled.');
  }

  /**
   * @description- Gets a boolean value from a user.
   * @return {Promise<number>} - Returns a promise that resolves to a boolean
   *    value selected by the user.
   */
  private async getIntValue(): Promise<number> {
    // Create a cancelation token instance to cancel the request when needed.
    const tokenSource: CancellationTokenSource = new CancellationTokenSource();
    const cancelIntToken: CancellationToken = tokenSource.token;
    const intInputOptions: InputBoxOptions = {
      prompt: 'Enter int value:',
      validateInput: (val: string) => {
        const re = /^\d*$/;
        return re.test(val) ? null : 'Error, invalid int input.';
      }
    };
    let value = null;

    try {
      const selectedValue = await window.showQuickPick(
        ['true', 'false'],
        intInputOptions,
        cancelIntToken
      ) || '';

      value = parseInt(selectedValue, 10);
    } catch (e) {
      window.showErrorMessage('Unable to get boolean value');
      console.log(e);
    }

    return value ? Promise.resolve(value) : Promise.reject('Unable to get boolean value');
  }

  /**
   * @description- Gets a boolean value from a user.
   * @return {Promise<string>} - Returns a Promise that resolves to a string
   *    value entered by the user.
   */
  private async getStringValue(): Promise<string> {
    // Create a cancelation token instance to cancel the request when needed.
    const tokenSource: CancellationTokenSource = new CancellationTokenSource();
    const cancelStringToken: CancellationToken = tokenSource.token;
    const stringInputOptions: InputBoxOptions = {
      prompt: 'Enter string value:',
      validateInput: this.validateString
    };
    let value = '';

    try {
      const userInput = await window.showInputBox(
        stringInputOptions,
        cancelStringToken
      ) || '';

      value = userInput;
    } catch (e) {
      window.showErrorMessage('Unable to get string value');
      console.log(e);
    }

    return Promise.resolve(value);
  }

  /**
   * @description- Gets the value to set a preference to based on the data type
   * of the attribute by calling the apporiate user input function.
   * @param {string} dataType - The attribute data type that needs to be set.
   * @return {Promise<any>} - Returns a Promise that resolves to the value the
   *    user has selcted to set the attribute to.
   */
  private async getValueToSet(element: MetadataNode): Promise<any> {
    const dataType =  element.preferenceValue ? element.preferenceValue.type : '';
    let prefValue;
    let success = true;

    try {
      // Set the options based on the data type.
      switch (dataType) {
        case 'boolean':
          prefValue = await this.getBooleanValue();
          break;
        case 'enum_of_int':
        case 'enum_of_string':
          prefValue = await this.getEnumValue(element);
          break;
        case 'int':
          prefValue = await this.getIntValue();
          break;
        case 'string':
          prefValue = await this.getStringValue();
          break;
        default:
          prefValue = 'Setting attribute on value type ' + dataType +
            ' is not currently supported.';
          success = false;
          break;
      }

      if (typeof prefValue === 'undefined') {
        window.showInformationMessage('Set attribute value cancelled.');
        success = false;
      }
    } catch (e) {
      success = false;
      console.log('Unable to set attribute value: ', e);
    }

    return success ? Promise.resolve(prefValue) : Promise.reject(prefValue);
  }

  /**
   * Handles the command action to set the value of a SitePreferences custom
   * attribute to the value specified by the user.
   * @param {MetadataNode} element - The selected element when the command was
   *    invoked to set the pref value.
   */
  public async setPrefValue(element: MetadataNode) {
    const par = element.parentId.split('.');
    const siteId = par.pop();
    const groupId = par.pop();
    let error = false;

    // Get the value to set the preference to from the user.
    const prefValue = await this.getValueToSet(element);
    if (typeof prefValue === 'undefined') {
        window.showErrorMessage('Could not set pref value.');
        error = true;
    }

    const prefId = element.preferenceValue ? element.preferenceValue.id : '';

    // Do not continue if there was an error.
    if (error || !prefId) {
      return Promise.resolve(false);
    }

    const body: IOCAPITypes.IDocumentObject = {};
    body['c_' + prefId] = prefValue;

    const callData = {
      group_id: groupId,
      site_id: siteId,
      instance_type: 'sandbox',
      body: JSON.stringify(body)
    };

    try {
      const callSetup = await this.service.getCallSetup(
        'sites',
        'setPrefValue',
        callData
      );

      const callResult = await this.service.makeCall(callSetup);
      console.log(callResult);
      if (callResult && !callResult.error) {
        window.showInformationMessage('Attribute value set.');
        return Promise.resolve(true);
      }
    } catch (e) {
      window.showErrorMessage('Unable to set preference value.');
      console.error(e.message);
    }
    return Promise.resolve(false);
  }
}
