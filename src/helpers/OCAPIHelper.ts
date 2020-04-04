/**
 * @file OCAPIHelper.ts
 * @fileoverview - Exports a single clsass for modeling the system object
 * attribute definitions, and interacting with the OCAPI service to add, modify,
 * and delete attribute definitions.
 */

import {
  CancellationToken,
  CancellationTokenSource,
  InputBoxOptions,
  QuickPickOptions,
  TreeItemCollapsibleState,
  window
} from 'vscode';
import { MetadataNode } from '../components/MetadataNode';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import { ICallSetup } from '../services/ICallSetup';
import { OCAPIService } from '../services/OCAPIService';

/**
 * @class OCAPIHelper
 * @classdesc - A class with static helper methods for assisting in making calls
 * to the SFCC Open Commerce API in order to read from and write too the system
 * object definitions used by the SFCC instance.
 */
export default class OCAPIHelper {
  private service: OCAPIService = new OCAPIService();

  /**
   * Expected values in OCAPI call are:
   *  - image, boolean, money, quantity,
   *    password, set_of_string, set_of_int, set_of_double, unknown
   */
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

  public static readonly ATTRIBUTE_MAP = {
    'integer': 'int',
    'number': 'double',
    'date + time': 'datetime',
    'enum of integers': 'enum_of_int',
    'enum of strings': 'enum_of_string',
    'set of integers': 'set_of_int',
    'set of numbers': 'set_of_double',
    'set of strings': 'set_of_string'
  };

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
    const includeFields = [
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
      objectType,
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
      window.showErrorMessage('ERROR making call to OCAPI: ' + e.message);
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
    const includeFields = ['displayName', 'description', 'id', 'position'];

    attributeGroup.position = 1.0;

    const docObj = attributeGroup.getDocument(includeFields);
    let _callSetup: ICallSetup = null;
    let _callResult: any;
    const callData: any = {
      body: JSON.stringify(docObj),
      objectType,
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
      window.showErrorMessage('ERROR: Unable to add new attribute group', e.message);
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
    const idWithoutAllowed = String(id);
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
    const containsSpecialChars = regex.test(id);

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

    let includeDescription = false;

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
      let attributeType = await window.showQuickPick(
        OCAPIHelper.ATTRIBUTE_TYPES,
        qpOptions,
        cancelAddAttributeToken
      );

      // If the user cancels, then exit the wizard.
      if (typeof attributeType === 'undefined') {
        return Promise.reject({ error: false, cancelled: true });
      }

      if (OCAPIHelper.ATTRIBUTE_MAP[attributeType.toLowerCase()]) {
        attributeType = OCAPIHelper.ATTRIBUTE_MAP[
          attributeType.toLowerCase()];
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

      // If the user doesn't cancel the Description input then add.
      if (typeof description !== 'undefined') {
        // Assign attribute values to the request document object.
        objAttributeDefinition.description.default = description;
        includeDescription = true;
      }

      objAttributeDefinition.displayName.default = displayName;
      objAttributeDefinition.valueType = attributeType.toLocaleLowerCase();
      objAttributeDefinition.id = attributeId;

      // Get the currently selected SystemObjects
      // const selected = metadataView.currentProvider.;

      // Return the reuslt of the API call.
      return this.addAttributeDefiniton(systemObjectId, objAttributeDefinition, includeDescription);
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
          count: 150,
          select: '(**)',
          objectType
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
            objectType,
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
        const errMsg = 'There are no attribute groups.';
        window.showErrorMessage(errMsg);
        Promise.reject(errMsg);
      }
    } catch (e) {
      const errMsg = 'Unable to assign attribute to group: ';
      console.log(errMsg + e.message);
      window.showErrorMessage('Unable to assign attribute to group.');
      return Promise.reject();
    }

    return Promise.reject('ERROR: Unable to assign attribute to group.');
  }

  /**
   * Deletes the selected attribute definition from the system object.
   *
   * @param {MetadataNode} node - The selected tree node instance.
   * @returns {Promise<any>} - Returns a Promise that resolves to a results
   *    object from the API call.
   */
  public async deleteAttributeDefinition(node: MetadataNode): Promise<any> {
    const path = node.parentId.split('.');
    const objectType = path[path.length - 2];
    const attributeId = node.objectAttributeDefinition.id;
    let _callSetup: ICallSetup;

    try {
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitions',
        'deleteAttribute',
        {
          objectType,
          id: attributeId
        }
      );

      return await this.service.makeCall(_callSetup);
    } catch (e) {
      console.log(e);
      // If there was an error, return the error message for display.
      return Promise.reject('ERROR occured while deleting the attribute.');
    }
  }

  /**
   * Deletes the selected attribute group from the system object.
   *
   * @param {MetadataNode} node - The selected tree node instance.
   * @returns {Promise<any>} - Returns a Promise that resolves to a results
   *    object from the API call.
   */
  public async deleteAttributeGroup(node: MetadataNode): Promise<any> {
    const path = node.parentId.split('.');
    const objectType = path[path.length - 2];
    const groupId = node.objectAttributeGroup.id;
    let _callSetup: ICallSetup;

    try {
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitions',
        'deleteAttributeGroup',
        {
          objectType,
          id: groupId
        }
      );

      return await this.service.makeCall(_callSetup);
    } catch (e) {
      console.log(e);
      // If there was an error, return the error message for display.
      return Promise.reject('ERROR occured while deleting the attribute.');
    }
  }

  /**
   * Gets the full System Object Attribute definition from OCAPI with value
   * definitions included.
   *
   * @param {MetadataNode} node - The selected tree node instance.
   */
  public async getExpandedAttribute(node: MetadataNode): Promise<any> {
    const path = node.parentId.split('.');
    let objectType = node.objectAttributeDefinition ? path[path.length - 2] :
      'SitePreferences';
    // Capitalize 1st letter of type for OCAPI.
    objectType = objectType.replace(/^\w/, c => c.toUpperCase());
    const attributeId = node.objectAttributeDefinition ?
      node.objectAttributeDefinition.id :
      node.preferenceValue.id;
    let _callSetup: ICallSetup;

    try {
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitions',
        'getAttribute',
        {
          objectType,
          id: attributeId,
          expand: 'value'
        }
      );

      return await this.service.makeCall(_callSetup);
    } catch (e) {
      console.log(e);
      // If there was an error, return the error message for display.
      return Promise.reject('ERROR occured while deleting the attribute.');
    }
  }

  /**
   * Get the tree nodes for the value definitions of an `enum-of-string` or
   * `enum-of-int` type attribute definition.
   *
   * @param {MetadataNode} node - The currently selected tree node instance.
   */
  public getValueDefinitionNodes(node: MetadataNode): MetadataNode[] {
    const attrVals = node.objectAttributeValueDefinitions;
    const parentId = node.parentId + '.valueDefinitions';
    if (attrVals.length) {
      return attrVals.map(val => {
        return new MetadataNode(String(val.value),
        TreeItemCollapsibleState.Collapsed,
        {
          parentId,
          objectAttributeValueDefinition: val
        });
      });
    } else {
      return [new MetadataNode('No values configured.',
        TreeItemCollapsibleState.None,
        {
          parentId,
          displayDescription: '---'
        }
      )];
    }
  }

  /**
   * Makes an OCAPI call to remove the specified attribute from the system
   * group that has been expanded in the explorer to reach the attribute.
   *
   * @param {MetadataNode} node - The node object for the attribute that needs
   *    to be removed from the attribute group.
   * @return {Promise<any>} - Returns a promise that resolves to the results of
   *    the remove from group call.
   */
  public async removeAttributeFromGroup(node: MetadataNode): Promise<any> {
    const path = node.parentId.split('.');
    const objectType = path[path.length - 4];
    const groupId = path[path.length - 2];
    const attributeId = node.name;
    let _callSetup: ICallSetup;

    try {
      _callSetup = await this.service.getCallSetup(
        'systemObjectDefinitions',
        'removeAttributeFromGroup',
        {
          objectType,
          groupId,
          attributeId
        }
      );

      return await this.service.makeCall(_callSetup);
    } catch (e) {
      console.log(e);
      // If there was an error, return the error message for display.
      return Promise.reject('ERROR occured while removing the attribute from ' +
        'the attribute group.');
    }
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
    const isCallAllowed = ALLOWED_SYSTEM_OBJECTS.some(
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
