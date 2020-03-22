import {
  CancellationToken,
  CancellationTokenSource,
  InputBoxOptions,
  QuickPickOptions,
  window
} from 'vscode';
import { MetadataNode } from '../components/MetadataNode';
import { OCAPIService } from '../services/OCAPIService';
import SitePreferencesHelper from './SitePreferencesHelper';

/**
 * @class
 * @classdesc - A helper class for handling command actions that are separate
 *    from the view provider functionality.
 */
export default class CommandHelper {
  private service: OCAPIService;
  private prefsHelper: SitePreferencesHelper;

  constructor() {
    this.service = new OCAPIService();
    this.prefsHelper = new SitePreferencesHelper(this.service);
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
  private validateString(input: string): string {
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
      );

      value = parseInt(selectedValue, 10);
    } catch (e) {
      window.showErrorMessage('Unable to get boolean value');
      console.log(e);
    }

    return Promise.resolve(value);
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
      );

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
  private async getValueToSet(dataType: string): Promise<any> {
    let prefValue;
    let success = true;

    // Set the options based on the data type.
    switch (dataType) {
      case 'boolean':
        prefValue = this.getBooleanValue();
        break;
      case 'int':
        prefValue = this.getIntValue();
        break;
      case 'string':
        prefValue = this.getStringValue();
        break;
      default:
        prefValue =
          'Setting attribute on value type ' + dataType + ' is not supported.';
        success = false;
        break;
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
    const dataType = element.preferenceValue.type;
    // Get the value to set the preference to from the user.
    const prefValue = await this.getValueToSet(dataType)
      .catch(err => {
        window.showErrorMessage(err);
        error = true;
      });

    // Do not continue if there was an error.
    if (error) {
      return Promise.resolve(false);
    }

    const body = {};
    body['c_' + element.preferenceValue.id] = prefValue;

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
      window.showInformationMessage('Attribute value set.');
      return Promise.resolve(true);
    } catch (e) {
      window.showErrorMessage('Unable to set preference value.');
      console.error(e.message);
    }
    return Promise.resolve(false);
  }
}
