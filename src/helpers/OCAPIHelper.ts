/**
 * @file OCAPIHelper.ts
 * @fileoverview - Exports a single clsass for modeling the system object
 * attribute definitions, and interacting with the OCAPI service to add, modify,
 * and delete attribute definitions.
 */

import { ICallSetup } from '../service/ICallSetup';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import { OCAPIService } from '../service/OCAPIService';
import { MetadataView } from '../components/MetadataView';
import {
  window,
  CancellationTokenSource,
  CancellationToken,
  QuickPickOptions,
  InputBoxOptions
} from 'vscode';
import { MetadataNode } from '../components/MetadataNode';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';

/**
 * @class OCAPIHelper
 * @classdesc - A class with static helper methods for assisting in making calls
 * to the SFCC Open Commerce API in order to read from and write too the system
 * object definitions used by the SFCC instance.
 */
export default class OCAPIHelper {
  private metadataView: MetadataView;
  private service: OCAPIService = new OCAPIService();

  public static readonly ATTRIBUTE_TYPES = [
    'Boolean',
    'Date',
    'Date + Time',
    'Email',
    'Enum of Integers',
    'Enum of Strings',
    'HTML',
    'Image',
    'Integer',
    'Number',
    'Password',
    'Set of Integers',
    'Set of Numbers',
    'Set of Strings',
    'String',
    'Text'
  ];

  /**
   * @param {MetadataView} metaView - The MetadataView class instance that can
   *    be used to read the seleted items in the MetadataViewProvider instance.
   */
  constructor(metaView: MetadataView) {
    this.metadataView = metaView;
  }

  /* ========================================================================
   * Private Instance Members
   * ======================================================================== */

  /**
   * Makes a call to the OCAPIService class to add a new system object attribute
   * definition to the system object who's Id is specified.
   *
   * @param {string} objectType - The Id of the system object to that the
   *    new attribute definition should be added to.
   * @param {ObjectAttributeDefinition} attributeDefinition - The object
   *    attribute defintion class instance that can be passed to the OCAPI
   *    service as the body of the request.
   * @returns {Promise<Object>} - Returns a promise that resoves to an Object.
   *    The object is the JSON result reutrned form the service call.
   */
  private async addAttributeDefiniton(
    objectType: string,
    attributeDefinition: ObjectAttributeDefinition,
    includeDescription: boolean = false
  ): Promise<any> {
    let includeFields = [
      'displayName',
      'key',
      'localizable',
      'mandatory',
      'searchable',
      'siteSpecific',
      'valueType',
      'visible'
    ];

    // Only include the description if it was specified.
    if (includeDescription) {
      includeFields.push('description');
    }

    const docObj = attributeDefinition.getDocument(includeFields);
    let _callSetup: ICallSetup = null;
    let _callResult: any;
    const callData: any = {
      body: JSON.stringify(docObj),
      objectType: objectType,
      id: attributeDefinition.id
    };

    try {
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitions',
        'createAttribute',
        callData
      );

      _callResult = await this.service.makeCall(_callSetup);
    } catch (e) {
      console.log(e);
    }

    return Promise.resolve(_callResult);
  }

  /**
   * Makes a call to the OCAPIService class to add a new attribute group to the
   * currently selected system object in the view.
   *
   * @param {string} objectType - The Id of the system object to that the
   *    new aattribute group will be added to.
   * @param {ObjectAttributeGroup} attributeGroup - An attribute group document.
   * @returns {Promise<Object>} - Returns a promise that resoves to an Object.
   *    The object is the JSON result reutrned form the service call.
   */
  private async addAttributeGroupDefiniton(
    objectType: string,
    attributeGroup: ObjectAttributeGroup
  ): Promise<any> {
    let includeFields = [
      'displayName',
      'description',
      'id',
      'position'
    ];

    attributeGroup.position = 1.0;

    const docObj = attributeGroup.getDocument(includeFields);
    let _callSetup: ICallSetup = null;
    let _callResult: any;
    const callData: any = {
      body: JSON.stringify(docObj),
      objectType: objectType,
      id: attributeGroup.id
    };

    try {
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitions',
        'createAttributeGroup',
        callData
      );

      _callResult = await this.service.makeCall(_callSetup);
    } catch (e) {
      console.log(e);
    }

    return Promise.resolve(_callResult);
  }

  /**
   * Presents the user with a selection box to choose which attribute group to
   * add the attribute to. Returns a promise that resolves with the selection.
   *
   * @param {string[]} groupIds - The attribute group Ids for the system object.
   * @returns {Promise<string>} - Returns a promise that resolves with the
   *    string Id of the selected attribute group as the data.
   */
  private async getGroupIdFromUser(groupIds: string[]): Promise<string> {
    const tokenSource: CancellationTokenSource = new CancellationTokenSource();
    const cancelAddAttributeToken: CancellationToken = tokenSource.token;
    const qpOptions: QuickPickOptions = {
      placeHolder: 'Select the attribute group'
    };
    let attributeId: string = '';

    try {
      // Show a select option box to choose the attribute group.
      attributeId = await window.showQuickPick(
        groupIds,
        qpOptions,
        cancelAddAttributeToken
      );
    } catch (e) {
      console.log(e);
      return Promise.reject('User Cancled Action');
    }

    return attributeId;
  }

  /**
   * Validates that a string is an allowed Id for a SFCC SystemObject attribute.
   *
   * @param {string} id - The Id to validate against the SFCC criteria.
   * @returns {string|null} - Returns an error message if the reuslt was not
   *    valid, OR returns null if the result was valid.
   */
  private validateAttributeId(id: string): string {
    // Make a copy of the id string without any allowed speial characters.
    let idWithoutAllowed = String(id);
    // Special chars allowed in SystemAttributeDefinition Id field.
    const allowedSpecialChars = [
      '+',
      '-',
      '$',
      '.',
      '%',
      '§',
      '&',
      '*',
      '#',
      '/'
    ];

    // Remove any allowed special characters.
    allowedSpecialChars.forEach(char => {
      idWithoutAllowed.replace(char, '');
    });

    // Validate that there are no more special characters.
    const regex = /\W/;
    let containsSpecialChars = regex.test(id);

    return containsSpecialChars
      ? 'Id for attribute contains illegal characters'
      : null;
  }

  /* ========================================================================
   * Public Instance Members
   * ======================================================================== */

  /**
   * Uses a 'wizard' like approach to get the needed information for creating a
   * new system object attribute definition.
   *  - Input boxes are displayed, one-by-one, to get the attribute definition
   *    properties.
   *  - A new node is added to the tree view representing the attribute values
   *    that have been entered.
   *  - An indicator is added to show that the attribute is still being
   *    processed while the request is made to the OCAPI service.
   *  - A request is made to the OCAPI endpoint to create the system object
   *    attribute definition, and the indicator is removed from the tree node.
   *
   * @param {string} objectType - The ID of the System Object Type that the new
   *    attribute should be added to.
   * @returns {Promise<any>} - Returns a Promise that resolves to a results
   *    object from the API call.
   */
  public async addAttributeNode(node: MetadataNode): Promise<any> {
    // Create a cancelation token instance to cancel the request when needed.
    const tokenSource: CancellationTokenSource = new CancellationTokenSource();
    const cancelAddAttributeToken: CancellationToken = tokenSource.token;
    const objAttributeDefinition: ObjectAttributeDefinition = new ObjectAttributeDefinition(
      {}
    );

    /**
     * @todo: Get display strings from a resource bundle.
     */

    // Get the system object from the current node.
    const systemObjectId = node.name;

    // Create options objects for the dialogs.
    const idInputOptions: InputBoxOptions = {
      prompt: 'Enter Attribute Id:',
      validateInput: this.validateAttributeId
    };
    const displayNameInputOptions: InputBoxOptions = {
      prompt: 'Enter Attribute Display Name:'
    };
    const qpOptions: QuickPickOptions = {
      placeHolder: 'Select the type for the attribute'
    };
    const descriptionInputOptions = {
      prompt: 'Enter Attribute Description (Optional):'
    };

    /* Begin Form Wizard
       ====================================================================== */
    try {
      // Show an input box for the user to enter the Id for the new attribute.
      const attributeId = await window.showInputBox(
        idInputOptions,
        cancelAddAttributeToken
      );

      // If the user cancels then the return is undefined.
      if (typeof attributeId === 'undefined') {
        return Promise.reject({ error: false, cancelled: true });
      }

      // Show a select option box to choose what type the new attribute will be.
      const attributeType = await window.showQuickPick(
        OCAPIHelper.ATTRIBUTE_TYPES,
        qpOptions,
        cancelAddAttributeToken
      );

      // If the user cancels, then exit the wizard.
      if (typeof attributeType === 'undefined') {
        return Promise.reject({ error: false, cancelled: true });
      }

      const displayName = await window.showInputBox(
        displayNameInputOptions,
        cancelAddAttributeToken
      );

      // If the user cancels, then exit the wizard.
      if (typeof displayName === 'undefined') {
        return Promise.reject({ error: false, cancelled: true });
      }

      const description = await window.showInputBox(
        descriptionInputOptions,
        cancelAddAttributeToken
      );

      // If the user cancels, then exit the wizard.
      if (typeof description === 'undefined') {
      }

      // Assign attribute values to the request document object.
      objAttributeDefinition.description.default = description;
      objAttributeDefinition.displayName.default = displayName;
      objAttributeDefinition.valueType = attributeType.toLocaleLowerCase();
      objAttributeDefinition.id = attributeId;

      // Get the currently selected SystemObjects
      // const selected = metadataView.currentProvider.;

      // Return the reuslt of the API call.
      return this.addAttributeDefiniton(systemObjectId, objAttributeDefinition);
    } catch (e) {
      console.log(e);
      return Promise.reject({
        error: true,
        cancelled: false,
        errorObject: e
      });
    }
  }

  /**
   * Uses a 'wizard' like approach to get the needed information for creating a
   * new attribute group.
   *  - Input boxes are displayed, one-by-one, to get the group properties.
   *  - A call is made to OCAPI to create the attribute definition.
   *  - The tree view is refreshed to show the new attribute in the view.
   *
   * @param {string} objectType - The ID of the System Object Type that the new
   *    attribute should be added to.
   * @returns {Promise<any>} - Returns a Promise that resolves to a results
   *    object from the API call.
   */
  public async addAttributeGroup(node: MetadataNode): Promise<any> {
    // Create a cancelation token instance to cancel the request when needed.
    const tokenSource: CancellationTokenSource = new CancellationTokenSource();
    const cancelAddGroupToken: CancellationToken = tokenSource.token;
    const attributeGroup: ObjectAttributeGroup = new ObjectAttributeGroup({});
    const objectType = node.objectTypeDefinition.objectType;

    const getIdOptions: InputBoxOptions = {
      prompt: 'Group Id: ',
      validateInput: this.validateAttributeId
    };
    const getDisplayNameOptions: InputBoxOptions = {
      prompt: 'Display Name: '
    };
    const getDescriptionOptions: InputBoxOptions = {
      prompt: 'Group Description: '
    };

    /* ======================================================================
     * Begin Form Wizard
     * ====================================================================== */
    try {
      // Get ID
      const attrGroupId: string = await window.showInputBox(
        getIdOptions,
        cancelAddGroupToken
      );

      // Handle user cancellation
      if (typeof attrGroupId === 'undefined') {
        return Promise.reject({ error: false, cancelled: true });
      }

      // Assign the new attribute to the OCAPI request document.
      attributeGroup.id = attrGroupId;

      // Get Attribute Group display name
      const attrGroupDisplayName = await window.showInputBox(
        getDisplayNameOptions,
        cancelAddGroupToken
      );

      // Handle User Cancellation
      if (typeof attrGroupDisplayName === 'undefined') {
        return Promise.reject({ error: false, cancelled: true });
      }

      // Assign to new attribute group instance.
      attributeGroup.displayName = attrGroupDisplayName;

      // Get Attribute Group display name
      const attrGroupDescription = await window.showInputBox(
        getDescriptionOptions,
        cancelAddGroupToken
      );

      // Handle User Cancellation
      if (typeof attrGroupDescription === 'undefined') {
        return Promise.reject({ error: false, cancelled: true });
      }

      // Assign to new attribute group instance.
      attributeGroup.description = attrGroupDescription;

      /* ====================================================================
       * End Form Wizard
       * ==================================================================== */

      return this.addAttributeGroupDefiniton(objectType, attributeGroup);
    } catch (e) {
      console.log(e);
      Promise.reject({ error: true, cancelled: false, errorObject: e });
    }
  }

  /**
   * Assings the speciifecd attribute definitions to the specified attribute
   * group using a call to the OCAPIService.
   *
   * @param node - An array of selected MetadataNodes
   */
  public async assignAttributesToGroup(node: MetadataNode): Promise<any> {
    const path = node.parentId.split('.');
    const objectType = path[path.length - 2];
    let availableGroups: string[] = [];
    let _callSetup: ICallSetup;
    let _callResult: any;

    // First, get the attribute groups to display as choices.
    try {
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitions',
        'getAttributeGroups',
        {
          select: '(**)',
          objectType: objectType
        }
      );

      _callResult = await this.service.makeCall(_callSetup);

      // If the API call returns data create the first level of a tree.
      if (
        !_callResult.error &&
        typeof _callResult.data !== 'undefined' &&
        Array.isArray(_callResult.data)
      ) {
        availableGroups = _callResult.data.map(group => group.id);
        const assignGroupId = await this.getGroupIdFromUser(availableGroups);

        _callSetup = await this.service.getCallSetup(
          'systemObjectDefinitions',
          'assignAttributeToGroup',
          {
            objectType: objectType,
            groupId: assignGroupId,
            attributeId: node.objectAttributeDefinition.id
          }
        );

        return await this.service.makeCall(_callSetup);
      } else if (
        !_callResult.error &&
        typeof _callResult.count !== 'undefined' &&
        _callResult.count === 0
      ) {
        Promise.reject('There are no attribute groups.');
      }
    } catch (e) {
      console.log('ERROR: Unable to assign attribute to group: ', e);
    }

    return Promise.reject('ERROR: Unable to assign attribute to group.');
  }

  /**
   * Makes an OCAPI call to set the default value of a system object attribute
   * if this operation is supported on the attribute/object type combination.
   *
   * @param {MetadataNode} node - The node object that was selected when the
   *    context menu option was selected.
   * @returns {Promise<any>} - Returns a promise that resolves with the reuslts
   *    of the call to the OCAPI endpoint.
   */
  public async setDefaultAttributeValue(node: MetadataNode): Promise<any> {
    const ALLOWED_SYSTEM_OBJECTS = [
      'SitePreferences',
      'OrganizationPreferences'
    ];
    const ALLOWED_ATTRIBUTE_TYPES = ['string', 'number', 'boolean'];

    const attributeDefinition: ObjectAttributeDefinition =
      node.objectAttributeDefinition;

    let isCallAllowed = ALLOWED_SYSTEM_OBJECTS.some(
      type => 'root.systemObjectDefinitions.' + type === node.parentId
    );

    // Check if this is a system object that allows for default attribute values,
    // and that the data type allows for default values.
    if (
      isCallAllowed &&
      ALLOWED_ATTRIBUTE_TYPES.indexOf(attributeDefinition.valueType) > -1
    ) {
      /** @todo make call to the OCAPI api to set the default value */
    }

    return Promise.reject('METHOD NOT IMPLEMENTED');
  }
}
