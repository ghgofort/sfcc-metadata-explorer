module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(1);
const MetadataView_1 = __webpack_require__(2);
const OCAPIHelper_1 = __webpack_require__(20);
const XMLHandler_1 = __webpack_require__(21);
/**
 * The entry point for the extension. This lifecycle method is called when the
 * extension is first loaded.
 *
 * @param context - The context object used to subscribe commands with.
 */
function activate(context) {
    // Setup view for System Object Definitions view.
    const metaView = new MetadataView_1.MetadataView(context);
    const ocapiHelper = new OCAPIHelper_1.default(metaView);
    const xmlHandler = new XMLHandler_1.default();
    metaView.getDataFromProvider('systemObjectDefinitions');
    /**
     * Binds the handler function for the event. The command has been defined in
     * the package.json file.
     *
     * @listens extension.sfccexplorer.systemobject.addattribute
     */
    const addAttributeDisposable = vscode_1.commands.registerCommand('extension.sfccexplorer.systemobject.addattribute', (metaNode) => {
        ocapiHelper
            .addAttributeNode(metaNode)
            .then(data => {
            metaView.currentProvider.refresh();
        })
            .catch(err => {
            vscode_1.window.showErrorMessage('Unable to add attribute: {0}', err);
            console.error(err);
        });
    });
    /**
     * Binds the handler function for the event. The command has been defined in
     * the package.json file.
     *
     * @listens extension.sfccexplorer.systemobject.addattribute
     */
    const deleteAttributeDisposable = vscode_1.commands.registerCommand('extension.sfccexplorer.systemobject.deleteattribute', (metaNode) => {
        ocapiHelper
            .deleteAttributeDefinition(metaNode)
            .then(data => {
            vscode_1.window.showInformationMessage('Attribute Deleted Successfully');
            console.log(data);
            metaView.currentProvider.refresh();
        })
            .catch(err => {
            vscode_1.window.showErrorMessage('Unable to delete attribute: {0}', err);
            console.log(err);
        });
    });
    /**
     * Binds the handler for the TreeViewProvider refresh action to its handler
     * function.
     *
     * @listens extension.sfccexplorer.refresh
     */
    const refreshTreeDisposable = vscode_1.commands.registerCommand('extension.sfccexplorer.refresh', (metaDataView) => {
        metaView.currentProvider.refresh();
    });
    /**
     * Binds the OCAPI helper method to handle the assigning of attributes to
     * attribute groups to the VSCode event.
     *
     * @listens extension.sfccexplorer.systemobjectattribute.addtogroup
     */
    const assignToGroupDisposable = vscode_1.commands.registerCommand('extension.sfccexplorer.systemobjectattribute.addtogroup', (metaNode) => {
        ocapiHelper
            .assignAttributesToGroup(metaNode)
            .then(data => {
            vscode_1.window.showInformationMessage('Attribute successfully added to group.');
            metaView.currentProvider.refresh();
        })
            .catch(err => {
            vscode_1.window.showErrorMessage('Unable to add attribute: {0}', err);
            console.log(err);
        });
    });
    /**
     * Binds the handler for the context menu command to set the default value of
     * a system object attribute.
     *
     * @listens extension.sfccexplorer.systemobjectattribute.setdefault
     */
    const setDefaultDisposable = vscode_1.commands.registerCommand('extension.sfccexplorer.systemobjectattribute.setdefault', (metaNode) => {
        ocapiHelper
            .setDefaultAttributeValue(metaNode)
            .then(data => {
            metaView.currentProvider.refresh();
        })
            .catch(err => {
            vscode_1.window.showErrorMessage('Unable to set default value: {0}', err);
            console.log(err);
        });
    });
    /**
     * Binds the handler for the context menu command to set the default value of
     * a system object attribute.
     *
     * @listens extension.sfccexplorer.objectattributegroup.addgroup
     */
    const addGroupDisposable = vscode_1.commands.registerCommand('extension.sfccexplorer.objectattributegroup.addgroup', (metaNode) => {
        ocapiHelper
            .addAttributeGroup(metaNode)
            .then(data => {
            metaView.currentProvider.refresh();
        })
            .catch(err => {
            // If the user canceled the action, then don't show an error.
            if (typeof err.error === 'boolean' &&
                err.error === false) {
                return;
            }
            vscode_1.window.showErrorMessage('Could not create attribute group: {0}', err);
            console.log(err);
        });
    });
    /**
     * Binds the handler to the context menu action to get the XML from a system
     * object attribute definition.
     *
     * @listens extension.sfccexplorer.systemobjectattribute.getxml
     */
    const getAttributeXMLDisposable = vscode_1.commands.registerCommand('extension.sfccexplorer.systemobjectattribute.getxml', (metaNode) => {
        xmlHandler.getXMLFromNode(metaNode);
    });
    context.subscriptions.push(getAttributeXMLDisposable);
    context.subscriptions.push(addGroupDisposable);
    context.subscriptions.push(assignToGroupDisposable);
    context.subscriptions.push(setDefaultDisposable);
    context.subscriptions.push(addAttributeDisposable);
    context.subscriptions.push(refreshTreeDisposable);
    context.subscriptions.push(deleteAttributeDisposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    /** @todo: Implement deactivate() lifecycle method in extension.ts */
}
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file MetadataView.ts
 * @fileoverview - Contains a class that defines the Metadata Explorer view
 * container and the contained views such as the system object definitions view.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(1);
const MetadataViewProvider_1 = __webpack_require__(3);
/**
 * @class MetadataView
 * @classdesc - A class with methods and properties for controlling what is
 *    displayed to the user when viewing the metadata explorer's view container.
 */
class MetadataView {
    /**
     * @constructor
     * @param {ExtensionContext} context - The extension context instance. This is
     *    used for subscribing to, and triggering VSCode events.
     */
    constructor(context) {
        this._context = null;
        this._providers = [];
        this.currentProvider = null;
        this._onMetaDataChange = new vscode_1.EventEmitter();
        this._context = context;
        this._onMetaDataChange = new vscode_1.EventEmitter();
    }
    /* ========================================================================
     * Public Instance Methods
     * ======================================================================== */
    /**
     * Populates the tree view with the specified type of SFCC data. When
     * called, this method will invoke the OCAPIService class to make a call
     * to the configured sandbox, and then render the individual SFCC metadata
     * items.
     *
     * @param {string} [providerType = 'systemObjectDefinitions'] - The type of
     *    data entities that the provider should serve to the tree view for
     *    rendering.
     */
    getDataFromProvider(providerType = 'systemObjectDefinitions') {
        this.currentProvider = this._getDataProvider(providerType);
        this._context.subscriptions.push(vscode_1.window.registerTreeDataProvider(providerType + 'View', this.currentProvider));
    }
    /* ========================================================================
     * Private Instance Methods
     * ======================================================================== */
    /**
     * Gets an instance of the MetadataViewProvider for populating the
     * Tree View with entities via a call to the OCAPIService class.
     *
     * @param {string} providerType - The name of the type of SFCC object that the
     *    data provider should retrieve via an OCAPI call. The name should be in
     *    cammel case (i.e. System Object Definitions = systemObjectDefinitions).
     */
    _getDataProvider(providerType) {
        // Check if there is already a MetadataViewProvider for the correct type.
        let dataProvider;
        if (this._providers.length) {
            dataProvider = this._providers.find((pr) => pr.providerType === providerType);
        }
        // If no existing provider for the specified type, then create it.
        if (!dataProvider) {
            dataProvider = new MetadataViewProvider_1.MetadataViewProvider(providerType, this._onMetaDataChange);
            this._providers.push(dataProvider);
        }
        return dataProvider;
    }
}
exports.MetadataView = MetadataView;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file MetadataViewProvider.ts
 * @fileoverview - This file holds the MetadataViewProvider class implementation
 * which is used for getting SFCC Metadata from the sandbox instance and
 * populating the tree view instance.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MetadataNode_1 = __webpack_require__(4);
const vscode_1 = __webpack_require__(1);
const OCAPIService_1 = __webpack_require__(5);
const ObjectTypeDefinition_1 = __webpack_require__(16);
const ObjectAttributeDefinition_1 = __webpack_require__(17);
const ObjectAttributeGroup_1 = __webpack_require__(19);
const ObjectAttributeValueDefinition_1 = __webpack_require__(18);
/**
 * @class MetadataViewProvider
 * @classdesc A generic tree data provider implementation that can be used for
 *    several getting data from the OCAPI service, and wiring the results to the
 *    TreeView instance.
 */
class MetadataViewProvider {
    /**
     *
     * @param {string} providerType - The type of provider being initialized;
     * @param {EventEmitter<MetadataNode | undefined>} eventEmitter
     */
    constructor(providerType, eventEmitter) {
        this.providerType = '';
        this.eventEmitter = null;
        this.service = new OCAPIService_1.OCAPIService();
        this.providerType = providerType;
        this.eventEmitter = eventEmitter;
        this.onDidChangeTreeData = this.eventEmitter.event;
    }
    /* ========================================================================
     * Public Instance Methods
     * ======================================================================== */
    /**
     * Refreshes the TreeView.
     */
    refresh() {
        this.eventEmitter.fire();
    }
    /**
     * Returns the individual TreeItem instance
     * @param {MetadataNode} element - The element associated with the given
     *    TreeItem instance.
     * @return {TreeItem | Thenable<TreeItem>} - Returns the instance of the
     *    TreeItem or a Promise that resolves to the TreeItem instance.
     */
    getTreeItem(element) {
        return element;
    }
    /**
     * Gets the children elements that are bound to the TreeItem instances for
     * rendering of the TreeView instance.
     * @param {MetadataNode} [element] - An optional parameter to use as the
     *    starting point for expansion of the tree when selected.
     * @return {Promise<MetadataNode[]>}
     */
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!element) {
                    // Get the base nodes of the tree.
                    return this.getRootChildren(element);
                }
                else {
                    // Get children of expandable node types
                    if (element.expandable) {
                        const nodeType = element.nodeType;
                        const parent = element.parentId.split('.').pop();
                        if (nodeType === 'baseNodeName') {
                            return this.getBaseNodeChildren(element);
                        }
                        else if (nodeType === 'objectTypeDefinition') {
                            return this.getObjectDefinitionChildren(element);
                        }
                        else if (nodeType === 'parentContainer') {
                            return this.getAttributeOrGroupContainerChildren(element);
                        }
                        else if (nodeType === 'objectAttributeDefinition') {
                            return this.getAttributeDefinitionChildren(element);
                        }
                        else if (nodeType === 'objectAttributeGroup') {
                            return this.getAttributeGroupChildren(element);
                        }
                        else if (nodeType === 'objectAttributeValueDefinition') {
                            return this.getAttributeValueDefinitionChildren(element);
                        }
                        else if (nodeType === 'stringList') {
                            return this.getStringListChildren(element);
                        }
                    }
                    else {
                        // Return an empty array for types that are not expandable.
                        return [];
                    }
                }
            }
            catch (e) {
                return Promise.reject(e.message);
            }
        });
    }
    /**
     * Gets the children elements of parent container type nodes. This
     * method calls OCAPI to get attribute definitions or the attribute groups
     * depending on which node was expanded. This method is used for both custom &
     * system type object definitions.
     * @param {MetadataNode} element - The MetadataNode instance.
     * @return {Promise<MetadataNode[]>} - Returns a promise that will resolve to
     *    the child MetadataNodes array.
     */
    getAttributeOrGroupContainerChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = element.parentId.split('.');
            const objectType = path.pop();
            const parentType = path.pop();
            const isAttribute = element.name !== 'Attribute Groups';
            let _callSetup = null;
            let _callResult;
            // If this is the node for attribute definitions.
            if (isAttribute) {
                // Get the System/Custom Object attributes.// Make the call to the OCAPI Service.
                try {
                    _callSetup = yield this.service.getCallSetup(parentType, 'getAttributes', {
                        select: '(**)',
                        count: 200,
                        objectType: objectType
                    });
                    _callResult = yield this.service.makeCall(_callSetup);
                }
                catch (e) {
                    throw new Error(e.toString());
                }
                // If the API call returns data create the first level of a tree.
                if (!_callResult.error &&
                    typeof _callResult.data !== 'undefined' &&
                    Array.isArray(_callResult.data)) {
                    return _callResult.data.map(resultObj => {
                        return new MetadataNode_1.MetadataNode(resultObj.id, vscode_1.TreeItemCollapsibleState.Collapsed, {
                            parentId: element.parentId + '.' + objectType,
                            objectAttributeDefinition: new ObjectAttributeDefinition_1.default(resultObj),
                            displayDescription: resultObj.display_name
                                ? resultObj.display_name.default
                                : ''
                        });
                    });
                }
                // If there is an error display a single node indicating that there
                // was a failure to load the object definitions.
                return [
                    new MetadataNode_1.MetadataNode('Unable to load...', vscode_1.TreeItemCollapsibleState.None, {
                        parentId: 'root.systemObjectDefinitions.' + objectType
                    })
                ];
            }
            else {
                // Make the call to the OCAPI Service to get the attribute groups.
                // Tree branch for attribute groups.
                _callSetup = yield this.service.getCallSetup('systemObjectDefinitions', 'getAttributeGroups', {
                    select: '(**)',
                    expand: 'definition',
                    objectType: objectType
                });
                _callResult = yield this.service.makeCall(_callSetup);
                // If the API call returns data create the first level of a tree.
                if (!_callResult.error &&
                    typeof _callResult.data !== 'undefined' &&
                    Array.isArray(_callResult.data)) {
                    return _callResult.data.map(resultObj => {
                        return new MetadataNode_1.MetadataNode(resultObj.id, vscode_1.TreeItemCollapsibleState.Collapsed, {
                            parentId: element.parentId + '.' + objectType,
                            objectAttributeGroup: new ObjectAttributeGroup_1.default(resultObj),
                            displayDescription: resultObj.display_name
                                ? resultObj.display_name.default
                                : ''
                        });
                    });
                }
                else if (!_callResult.error &&
                    typeof _callResult.count !== 'undefined' &&
                    _callResult.count === 0) {
                    // If there are no attribute groups defined then create a single node
                    // with a message for the user.
                    return [
                        new MetadataNode_1.MetadataNode('No attribute groups defined', vscode_1.TreeItemCollapsibleState.None, {
                            parentId: element.parentId + '.' + objectType
                        })
                    ];
                }
                // If there is an error display a single node indicating that there
                // was a failure to load the object definitions.
                return [
                    new MetadataNode_1.MetadataNode('Unable to load...', vscode_1.TreeItemCollapsibleState.None, {
                        parentId: element.parentId + '.' + objectType
                    })
                ];
            }
        });
    }
    /**
     * Gets the children elements of base tree nodes.
     * @param {MetadataNode} element - The MetadataNode instance.
     * @return {Promise<MetadataNode[]>} - Returns a promise that will resolve to
     *    the child MetadataNodes array.
     */
    getBaseNodeChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseName = element.baseNodeName;
            /**
             * @todo: REFACTOR: Use OCAPI system_object_definition_search call to filter
             *    results for only system or custom object definitions on the server
             *    before returning results.
             */
            const _callSetup = yield this.service.getCallSetup(baseName, 'getAll', {
                count: 200,
                select: '(**)'
            });
            // Call the OCAPI service.
            const _callResult = yield this.service.makeCall(_callSetup);
            // If the API call returns data create a tree.
            if (_callResult.data && Array.isArray(_callResult.data)) {
                // Add the display name to the custom objects so that they can be
                // easily identified as custom.
                return _callResult.data.filter(obj => {
                    return baseName === 'systemObjectDefinitions' ?
                        (obj.object_type !== 'CustomObject') :
                        (obj.object_type === 'CustomObject' && obj.display_name);
                }).map(filterdObj => {
                    // Get the display name for the tree node.
                    let name = '';
                    if (baseName === 'systemObjectDefinitions') {
                        name = filterdObj.object_type;
                    }
                    else if (baseName === 'customObjectDefinitions') {
                        name = filterdObj.display_name.default;
                    }
                    // Create a MetaDataNode instance which implements the TreeItem
                    // interface and holds the data of the document type that it
                    // represents.
                    return new MetadataNode_1.MetadataNode(name, vscode_1.TreeItemCollapsibleState.Collapsed, {
                        parentId: 'root.' + baseName,
                        objectTypeDefinition: new ObjectTypeDefinition_1.default(filterdObj),
                        displayDescription: ' '
                    });
                });
            }
        });
    }
    /**
     * Gets the base nodes of the tree that can be expanded for viewing data types.
     * @param {MetadataNode} element - The MetadataNode instance.
     * @return {Promise<MetadataNode[]>} - Returns a promise that will resolve to
     *    the child MetadataNodes array.
     */
    getRootChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const metaNodes = [];
            // Get the workspace configuration object for all configuration settings
            // related to this extension.
            const workspaceConfig = vscode_1.workspace.getConfiguration('extension.sfccmetadata');
            // Get the VSCode settings for display of each base tree node.
            // - Show System Object Definitions
            const showSystemObjects = Boolean(workspaceConfig.get('explorer.systemobjects'));
            // - Show Custom Object Definitions
            const showCustomObjects = Boolean(workspaceConfig.get('explorer.customobjects'));
            // If the user config is enabled, then show the option.
            if (showSystemObjects) {
                metaNodes.push(new MetadataNode_1.MetadataNode('System Object Definitions', vscode_1.TreeItemCollapsibleState.Collapsed, {
                    parentId: 'root',
                    baseNodeName: 'systemObjectDefinitions'
                }));
            }
            // If display of Custom Object Definitions is enabled, add node to tree.
            if (showCustomObjects) {
                metaNodes.push(new MetadataNode_1.MetadataNode('Custom Object Definitions', vscode_1.TreeItemCollapsibleState.Collapsed, {
                    parentId: 'root',
                    baseNodeName: 'customObjectDefinitions'
                }));
            }
            return Promise.resolve(metaNodes);
        });
    }
    /**
     * Gets the children elements of System & Custom object type nodes.
     * @param {MetadataNode} element - The MetadataNode instance.
     * @return {Promise<MetadataNode[]>}
     */
    getObjectDefinitionChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const displayTextMap = {
                objectAttributeDefinitions: 'Attribute Definitions',
                objectAttributeGroups: 'Attribute Groups'
            };
            // Setup parent nodes for the attribute definition & the attribute
            // Group nodes to be added to.
            return Object.keys(displayTextMap).map(ctnrName => {
                const metaNode = new MetadataNode_1.MetadataNode(displayTextMap[ctnrName], element.parentId.indexOf('customObjectDefinitions') > -1 ?
                    vscode_1.TreeItemCollapsibleState.None :
                    vscode_1.TreeItemCollapsibleState.Collapsed, {
                    displayDescription: ctnrName === 'objectAttributeDefinitions'
                        ? element.objectTypeDefinition.attributeDefinitionCount.toString()
                        : element.objectTypeDefinition.attributeGroupCount.toString(),
                    parentContainer: ctnrName,
                    parentId: element.parentId + '.' + element.objectTypeDefinition.objectType
                });
                return metaNode;
            });
        });
    }
    /**
     * Gets the children elements of AttributeValueDefinition type nodes.
     * @param {MetadataNode} element - The MetadataNode instance.
     * @return {Promise<MetadataNode[]>}
     */
    getAttributeValueDefinitionChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.keys(element.objectAttributeValueDefinition).map(key => {
                const value = element.objectAttributeValueDefinition[key];
                if (typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean') {
                    // == Primitive Types
                    return new MetadataNode_1.MetadataNode(key + ': ' + value, vscode_1.TreeItemCollapsibleState.None, {
                        parentId: element.parentId + 'objectAttributeValueDefinition'
                    });
                }
                else {
                    // == Localized String
                    return new MetadataNode_1.MetadataNode(key + ': ' + value.default, vscode_1.TreeItemCollapsibleState.None, {
                        parentId: element.parentId + 'objectAttributeValueDefinition'
                    });
                }
            });
        });
    }
    /**
     * Gets the children elements of ObjectAttributeGroup type nodes.
     * @param {MetadataNode} element - The MetadataNode instance.
     * @return {Promise<MetadataNode[]>}
     */
    getAttributeGroupChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const childNodes = [];
            const attrGroup = element.objectAttributeGroup;
            const hasAttributes = attrGroup.attributeDefinitionsCount > 0;
            // Attribute Definitions
            if (hasAttributes) {
                const attrDefTitles = attrGroup.attributeDefinitions.map(attrDef => attrDef.id);
                childNodes.push(new MetadataNode_1.MetadataNode('Attributes', vscode_1.TreeItemCollapsibleState.Collapsed, {
                    parentId: element.parentId + '.' + element.id,
                    stringList: attrDefTitles,
                    displayDescription: attrGroup.attributeDefinitionsCount.toString()
                }));
            }
            const nodeMap = {
                displayName: 'display name'
            };
            [
                'id',
                'description',
                'displayName',
                'internal',
                'position',
                'link'
            ].forEach(property => {
                const propertyNode = new MetadataNode_1.MetadataNode(nodeMap[property] || property, vscode_1.TreeItemCollapsibleState.None, {
                    parentId: element.parentId + '.' + attrGroup.id,
                    displayDescription: attrGroup[property]
                });
                childNodes.push(propertyNode);
            });
            return Promise.resolve(childNodes);
        });
    }
    /**
     * Gets the children elements of ObjectAttributeDefinition type nodes.
     * @param {MetadataNode} element - The MetadataNode instance.
     * @return {Promise<MetadataNode[]>}
     */
    getAttributeDefinitionChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const objAttrDef = element.objectAttributeDefinition;
            // Loop through the member properties and handle each possible type
            // for display as a node on the tree.
            return Object.keys(objAttrDef).map(key => {
                // == Primitive Types
                if (typeof objAttrDef[key] === 'string' ||
                    typeof objAttrDef[key] === 'number' ||
                    typeof objAttrDef[key] === 'boolean') {
                    return new MetadataNode_1.MetadataNode(key + ' : ' + objAttrDef[key], vscode_1.TreeItemCollapsibleState.None, {
                        parentId: element.parentId + '.' + element.objectAttributeDefinition.id
                    });
                }
                else if (
                // == Localized Strings
                typeof objAttrDef[key] === 'object' &&
                    objAttrDef[key] !== null &&
                    typeof objAttrDef[key].default === 'string') {
                    return new MetadataNode_1.MetadataNode(key + ' : ' + objAttrDef[key].default, vscode_1.TreeItemCollapsibleState.None, {
                        parentId: element.parentId + '.' + element.objectAttributeDefinition.id
                    });
                }
                else if (objAttrDef[key] instanceof ObjectAttributeValueDefinition_1.default) {
                    // == ObjectAttributeValueDefinition
                    if (typeof objAttrDef[key].id !== 'undefined') {
                        return new MetadataNode_1.MetadataNode(key + ': ' + objAttrDef[key].id, vscode_1.TreeItemCollapsibleState.Collapsed, {
                            objectAttributeValueDefinition: objAttrDef[key],
                            parentId: element.parentId + '.' + element.objectAttributeDefinition.id
                        });
                    }
                    return new MetadataNode_1.MetadataNode(key + ': (undefined)', vscode_1.TreeItemCollapsibleState.None, {
                        objectAttributeValueDefinition: objAttrDef[key],
                        parentId: element.parentId + '.' + element.objectAttributeDefinition.id
                    });
                }
            });
        });
    }
    /**
     * Gets the children elements simple string array type nodes.
     * @param {MetadataNode} element - The MetadataNode instance.
     * @return {Promise<MetadataNode[]>}
     */
    getStringListChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            return element.stringList.map(str => new MetadataNode_1.MetadataNode(str, vscode_1.TreeItemCollapsibleState.None, {
                parentId: element.parentId + '.' + element.name
            }));
        });
    }
}
exports.MetadataViewProvider = MetadataViewProvider;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file MetadataNode.ts
 * @fileoverview - This file contains a class that is used for creating nodes
 * on a tree view for display of SFCC metadata objects. This is a generic class used
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(1);
/**
 * @class MetadataNode
 * @extends TreeItem
 * @classdesc A generic class representing a metadata entity returned from a
 * reqeust to OCAPI. This can be an an object type, attribute group, attribute,
 * property, or value.
 */
class MetadataNode extends vscode_1.TreeItem {
    /**
     * The constructor function that calls the super class constructor, and then
     * initializes the custom logic for the MetaNode class.
     *
     * @param {string} name - The name of the node to be used as a label.
     * @param {TreeItemCollapsibleState} collapsibleState - The collapsible state
     *    constant: 'Collapsed', 'Expanded', & 'None'.
     * @param {ObjectTypeDefinition | ObjectAttributeDefinition | ObjectAttributeGroup | string} value - The object type
     *    definition instance, or an empty instance if this is only a parent
     *    container.
     * @constructor
     */
    constructor(name, collapsibleState, nodeData) {
        // Call the TreeNode constructor.
        super(name, collapsibleState);
        this.name = name;
        this.collapsibleState = collapsibleState;
        const instance = this;
        // The types of tree nodes that have child nodes.
        const expandableTypes = Object.keys(MetadataNode.nodeTypes)
            .filter(nodeType => nodeType !== 'value');
        // Loop through the nodeData Object properties to get the correct type.
        // There will only be one property, since the node can only be one of the
        // specified types.
        Object.keys(nodeData)
            .filter(attrName => attrName !== 'parentId' &&
            attrName !== 'displayDescription')
            .forEach(_dataType => {
            instance[_dataType] = nodeData[_dataType];
            const nodeTypeIndex = expandableTypes.findIndex(type => {
                return MetadataNode.nodeTypes[type] === _dataType;
            });
            instance._nodeType = expandableTypes[nodeTypeIndex];
            instance.contextValue = expandableTypes[nodeTypeIndex];
        });
        // Set the instance member properties for the child Class.
        this._expandable = expandableTypes.indexOf(this._nodeType) > -1;
        this.parentId = nodeData.parentId;
        this.displayDescription = nodeData.displayDescription || '';
    }
    /* Member Mutators & Accessors
       ======================================================================== */
    /** @member {boolean} expandable - Boolean for if the node is expandable. */
    get expandable() { return this._expandable; }
    set expandable(value) { this._expandable = value; }
    /** @member {string} nodeType - Readonly string for getting the node type. */
    get nodeType() { return MetadataNode.nodeTypes[this._nodeType]; }
    /** @member {string} tooltip - Readonly string for rendering a tooltip. */
    get tooltip() { return this.name; }
    get description() { return this.displayDescription || ''; }
}
/**
 * @static
 * @member {{definition: string, attribute: string, group: string}} nodeTypes -
 *    An object literal mapping short names for node types to their SFCC
 *    document types.
 */
MetadataNode.nodeTypes = {
    parentContainer: 'parentContainer',
    baseNodeName: 'baseNodeName',
    definition: 'objectTypeDefinition',
    attribute: 'objectAttributeDefinition',
    attributeValue: 'objectAttributeValueDefinition',
    group: 'objectAttributeGroup',
    stringList: 'stringList',
    value: 'value'
};
exports.MetadataNode = MetadataNode;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file OCAPIService
 * @fileoverview - Provides a service for making calls to the Open Commerce API
 *    when exposed on a Sales Force Commerce Cloud sandbox instance.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(6);
const node_fetch_1 = __webpack_require__(7);
const vscode_1 = __webpack_require__(1);
const apiConfig_1 = __webpack_require__(13);
const OAuth2Token_1 = __webpack_require__(14);
const ICallSetup_1 = __webpack_require__(15);
const url_1 = __webpack_require__(10);
/**
 * @class OCAPIService
 * Proivdes REST request methods for making calls to the SFCC Open Commerce API.
 */
class OCAPIService {
    constructor() {
        this.authToken = null;
        this.isGettingToken = false;
        this.dwConfig = {
            hostname: '',
            ok: false,
            password: '',
            username: ''
        };
    }
    /**
     * Returns an object literal that conforms to the ICallSetup interface so that
     * it can be passed directly to the makeCall() method of this class.
     * @public
     * @param {string} resourceName - The name of the OCAPI Data API resource to query.
     * @param {string} callName - The name of the SFCC OCAPI call to make. The name is
     *    in the format that is used in the URI to identify which asset we are
     *    requesting form the server.
     * @param {Object} [callData] - An object of key/value pairs to be extracted into the
     *    URL parameters, headers, and body of the OCAPI request.
     * @returns An object conforming to the ICallSetup interface with the data
     *    for making the call to the API endpoint, or an appropriate error
     *    message.
     */
    getCallSetup(resourceName, callName, callData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Setup default values where appropriate.
            const setupResult = {
                body: {},
                callName: '',
                endpoint: '',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: ICallSetup_1.HTTP_VERB.get,
                setupErrMsg: '',
                setupError: false
            };
            let resConfig;
            let callConfig;
            // Check that calls to the specified resource have been configured in the
            // apiConig.ts configuration file.
            if (apiConfig_1.apiConfig.resources.hasOwnProperty(resourceName)) {
                resConfig = apiConfig_1.apiConfig.resources[resourceName];
            }
            else {
                setupResult.setupError = true;
                setupResult.setupErrMsg +=
                    '\nNo setup found in apiConfig for resource: ' + resourceName;
            }
            // If an API is specified, then append it to the endpoint.
            if (resConfig && resConfig.api) {
                setupResult.endpoint += '/s/-/dw/' + resConfig.api + '/';
            }
            else {
                setupResult.setupError = true;
                setupResult.setupErrMsg +=
                    '\nNo API version was specified in the apiConfig object';
            }
            if (apiConfig_1.apiConfig.hasOwnProperty('version')) {
                setupResult.endpoint += apiConfig_1.apiConfig.version + '/';
            }
            else {
                setupResult.setupError = true;
                setupResult.setupErrMsg +=
                    '\nNo API version is specified in the apiConfig';
            }
            // Check if the call name is configured for the specified resource.
            if (resConfig &&
                resConfig.availableCalls &&
                resConfig.availableCalls.hasOwnProperty(callName)) {
                setupResult.callName = callName;
                callConfig = resConfig.availableCalls[callName];
            }
            else {
                setupResult.setupError = true;
                setupResult.setupErrMsg +=
                    '\nNo matching method call found for: ' +
                        callName +
                        '\nResource: ' +
                        resourceName;
            }
            // Add the path to the endpoint.
            if (callConfig && callConfig.path) {
                setupResult.endpoint += callConfig.path;
            }
            else {
                setupResult.setupError = true;
                setupResult.setupErrMsg += '\nMissing call path in the apiConfig:';
                setupResult.setupErrMsg += '\n- OCAPI resource: ' + resourceName;
                setupResult.setupErrMsg += '\n- Call type: ' + callName;
            }
            // If headers are specified, then replace the default with the specified.
            if (callConfig && callConfig.headers) {
                setupResult.headers = callConfig.headers;
            }
            if (callConfig && callConfig.method) {
                setupResult.method = callConfig.method;
            }
            // Check that any required parameters are included in the callData.
            if (callConfig && callConfig.params && callConfig.params.length) {
                const usedParams = [];
                // If an explicit body was included, then append it to the seutp object.
                if ('body' in callData) {
                    if (typeof callData.body === 'string') {
                        setupResult.body = encodeURIComponent(setupResult.body);
                    }
                    setupResult.body = callData.body;
                    usedParams.push('body');
                }
                callConfig.params.forEach(param => {
                    const replaceMe = '{' + param.id + '}';
                    if (callData[param.id] &&
                        typeof callData[param.id] === param.type &&
                        typeof param.use === 'string' &&
                        usedParams.indexOf(param.id) === -1) {
                        // Determine where the parameter needs to be included in the
                        // call and add it to the call setup object.
                        if (param.use === 'PATH_PARAMETER' &&
                            setupResult.endpoint.indexOf(replaceMe) > -1) {
                            setupResult.endpoint = setupResult.endpoint.replace(replaceMe, callData[param.id]);
                        }
                        else if (param.use === 'QUERY_PARAMETER') {
                            // Check if this is the first query string parameter, or an
                            // additional parameter being added to the list.
                            setupResult.endpoint +=
                                setupResult.endpoint.indexOf('?') > -1 ? '&' : '?';
                            // Append to the URL as a query string type parameter.
                            setupResult.endpoint +=
                                encodeURIComponent(param.id) +
                                    '=' +
                                    encodeURIComponent(callData[param.id]);
                        }
                        else {
                            // If the request supports a call body, then any parameter data
                            // that is not specified as a parameter in the config will be
                            // added to the body of the request.
                            setupResult.body[param.id] = callData[param.id];
                        }
                        // Mark this parameter as used.
                        usedParams.push(param.id);
                    }
                    else {
                        setupResult.setupError = true;
                        setupResult.setupErrMsg += '\nMissing call parameter: ' + param;
                        setupResult.setupErrMsg += '\n- Resource: ' + resourceName;
                        setupResult.setupErrMsg += '\n- Call type: ' + callName;
                    }
                });
                // Remove any already added data properties.
                const dataKeys = Object.keys(callData).filter(k => usedParams.indexOf(k) === -1);
                if (dataKeys.length) {
                    // Loop through any keys that are not in the API config and add them to
                    // the request in either the URI or the Body of the request, based on the
                    // HTTP method used.
                    dataKeys.forEach(function (optionalParam) {
                        // Add any remaining parameters to the request.
                        if (setupResult.method === ICallSetup_1.HTTP_VERB.get) {
                            setupResult.endpoint +=
                                setupResult.endpoint.indexOf('?') > -1 ? '&' : '?';
                            setupResult.endpoint +=
                                encodeURIComponent(optionalParam) +
                                    '=' +
                                    encodeURIComponent(callData[optionalParam]);
                        }
                        else {
                            setupResult.body[optionalParam] = callData[optionalParam];
                        }
                    });
                }
            }
            // If the call setup was complete, then get the sandbox configuration.
            if (!setupResult.setupError) {
                // Get the sandbox configuration.
                this.dwConfig = yield this.getDWConfig();
                if (!this.dwConfig.ok) {
                    setupResult.setupError = true;
                }
                else {
                    // Concatenate the sandbox URL with the call endpoint to get the
                    // complete endpoint URI.
                    setupResult.endpoint =
                        'https://' + this.dwConfig.hostname + setupResult.endpoint;
                    // Check if there needs to be an OAuth2 token included with the request.
                    if (callConfig && typeof callConfig.authorization === 'string') {
                        const token = yield this.getOAuth2Token(callConfig.authorization);
                        setupResult.headers['Authorization'] =
                            token.tokenType + ' ' + token.accessToken;
                    }
                }
            }
            else {
                console.error('ERROR in setupResult', setupResult);
            }
            return setupResult;
        });
    }
    /**
     * Gets an OAuth 2.0 token wich is then included in the authorization header
     * for subsequent calls to the OCAPI Shop or Data APIs. The grant is requested
     * from either the Digital Application Server for a BM user grant type, or
     * from the Digital Authorization Server for a client credentials grant type.
     *
     * @param {string} tokenType - The type of token that is needed for the API
     *    call to be made. This should either be 'BM_USER' for a Business Manager
     *    User type of token, or 'CLIENT_CREDENTIALS' for a Client Credentials
     *    type of token. See the OCAPI documentation for more information about
     *    token types.
     */
    getOAuth2Token(tokenType) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the sandbox configuration.
            this.dwConfig = yield this.getDWConfig();
            if (!this.dwConfig.ok) {
                console.error('DW config is no bueno...');
                return Promise.reject('There was an error parsing the dw.json config file');
            }
            else if (tokenType === 'BM_USER' &&
                apiConfig_1.apiConfig.hasOwnProperty('clientId')) {
                this.isGettingToken = true;
                // Concatenate the pieces of the URL.
                let url = 'https://' +
                    this.dwConfig.hostname +
                    '/dw/oauth2/access_token?client_id=' +
                    apiConfig_1.apiConfig.clientId;
                // Encode credentials to base64
                const encodedString = Buffer.from(this.dwConfig.username +
                    ':' +
                    this.dwConfig.password +
                    ':' +
                    apiConfig_1.apiConfig.clientPassword).toString('base64');
                const authString = 'Basic ' + encodedString;
                const bodyParams = new url_1.URLSearchParams();
                bodyParams.append('grant_type', 'urn:demandware:params:oauth:grant-type:client-id:dwsid:dwsecuretoken');
                const result = new Promise((resolve, reject) => {
                    node_fetch_1.default(url, {
                        body: bodyParams,
                        headers: {
                            Authorization: authString,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        method: 'POST'
                    })
                        .then(resp => {
                        if (resp.ok) {
                            return resp.json();
                        }
                        else {
                            reject('Could not retrieve Auth Token from Digital Application Server');
                        }
                    })
                        .then(resp => {
                        this.authToken = new OAuth2Token_1.OAuth2Token(resp);
                        resolve(this.authToken);
                    })
                        .catch(e => {
                        reject(e);
                    });
                });
                return result;
            }
            else if (tokenType === 'CLIENT_CREDENTIALS') {
                /** @todo: implement getOAuth2Token for auth server authentication */
            }
        });
    }
    /**
     * Makes a call to the SFCC Open Commerce API using node-fetch.
     * @param {ICallSetup} callSetup - The OCAPI call setup object that implements
     *    the interface ICallSetup.
     * @return {Promise<any>} - Returns a promise that resolves to the returned &
     *    formatted data from the API call or an error message if there was an
     *    exception durring the execution of the API call.
     */
    makeCall(callSetup) {
        return __awaiter(this, void 0, void 0, function* () {
            let params;
            if (callSetup.body && Object.keys(callSetup.body).length > 0) {
                params = {
                    headers: callSetup.headers,
                    method: callSetup.method,
                    body: callSetup.body
                };
            }
            else {
                params = {
                    headers: callSetup.headers,
                    method: callSetup.method
                };
            }
            return yield node_fetch_1.default(callSetup.endpoint, params)
                .then(resp => {
                if (resp.ok && resp.statusText.toLowerCase() === 'no content') {
                    return {};
                }
                else if (resp.ok) {
                    return resp.json();
                }
                else {
                    const errMsg = resp.statusText + ' :: Code ' + resp.status;
                    vscode_1.window.showErrorMessage('ERROR in OCAPI call: ' + errMsg);
                    return { error: true, errorMessage: errMsg };
                }
            })
                .catch(err => {
                const errMsg = 'There was an error making the Open Commerce' +
                    ' API call: ' + err.name + '\n' + 'Message: ' + err.message;
                vscode_1.window.showErrorMessage('ERROR in OCAPI call: ' + errMsg);
                return { error: true, errorMessage: errMsg };
            });
        });
    }
    /**
     * Gets the sandbox connection configuration from a dw.json configuration file
     * in one of the workspace folders.
     *
     * @private
     * @return {IDWConfig} - Returns a Promise that resolves to a an
     *    object literal that conforms to the IDWConfig interface definition.
     * @author github: sqrtt
     *    This is a helper function that was borrowed from the Prophet debugger
     *    extension for debugging and development of SFCC code.
     */
    getDWConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the configuration has already been loaded.
            if (this.dwConfig.hostname &&
                this.dwConfig.username &&
                this.dwConfig.password &&
                this.dwConfig.ok) {
                return yield Promise.resolve(this.dwConfig);
            }
            else {
                // Setup the default response.
                let result = {
                    hostname: '',
                    ok: false,
                    password: '',
                    username: ''
                };
                // Check all of the folders in the current workspace for the existance of
                // one or more dw.json files.
                const workspaceFolders = vscode_1.workspace.workspaceFolders || [];
                const dwConfigFiles = yield Promise.all(workspaceFolders.map(wf => vscode_1.workspace.findFiles(new vscode_1.RelativePattern(wf, '**/dw.json'), new vscode_1.RelativePattern(wf, '{node_modules,.git,RemoteSystemsTempFiles}'))));
                let configFiles = [];
                dwConfigFiles.forEach(uriSubArray => {
                    configFiles = configFiles.concat(uriSubArray);
                });
                // Get rid of any paths that return undefined or null when evaluated.
                configFiles = configFiles.filter(Boolean);
                // 1 dw.json file found
                if (configFiles.length === 1 && configFiles[0].fsPath) {
                    result = yield this.readConfigFromFile(configFiles[0].fsPath);
                    // > 1 dw.json file found
                }
                else if (configFiles.length > 1) {
                    const dwConfig = yield vscode_1.window.showQuickPick(configFiles.map(config => config.fsPath), { placeHolder: 'Select configuration' });
                    result = yield this.readConfigFromFile(dwConfig);
                }
                return result;
            }
        });
    }
    /**
     * Reads the SFCC sandbox configuration from a dw.json configuration file and
     * an object that conforms to the IDWConfig interface with key/value pairs for
     * the needed sandbox configuration fields.
     *
     * @param {string} filePath - The file path for the dwconfig.json file to be read.
     * @return {Promise<IDWConfig>} - Returns a promise that resolves with the
     *    configuration object read from the selected dw.json file.
     */
    readConfigFromFile(filePath) {
        return new Promise((resolve, reject) => {
            // Create a stream to read the data from the file.
            const chunks = [];
            const readStream = fs_1.createReadStream(filePath);
            readStream.on('data', chunk => {
                chunks.push(chunk);
            });
            readStream.on('error', e => {
                reject(e);
            });
            readStream.on('close', () => {
                try {
                    const conf = JSON.parse(Buffer.concat(chunks).toString());
                    conf.configFilename = filePath;
                    conf.ok = true;
                    resolve(conf);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
}
exports.OCAPIService = OCAPIService;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Headers", function() { return Headers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Request", function() { return Request; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Response", function() { return Response; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FetchError", function() { return FetchError; });
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var zlib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12);






// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js
// (MIT licensed)

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = stream__WEBPACK_IMPORTED_MODULE_0__.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (typeof body === 'string') ; else if (isURLSearchParams(body)) ; else if (body instanceof Blob) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') ; else if (ArrayBuffer.isView(body)) ; else if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__) ; else {
		// none of the above
		// coerce to string
		body = String(body);
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}

};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	// body is null
	if (this.body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is string
	if (typeof this.body === 'string') {
		return Body.Promise.resolve(Buffer.from(this.body));
	}

	// body is blob
	if (this.body instanceof Blob) {
		return Body.Promise.resolve(this.body[BUFFER]);
	}

	// body is buffer
	if (Buffer.isBuffer(this.body)) {
		return Body.Promise.resolve(this.body);
	}

	// body is ArrayBuffer
	if (Object.prototype.toString.call(this.body) === '[object ArrayBuffer]') {
		return Body.Promise.resolve(Buffer.from(this.body));
	}

	// body is ArrayBufferView
	if (ArrayBuffer.isView(this.body)) {
		return Body.Promise.resolve(Buffer.from(this.body.buffer, this.body.byteOffset, this.body.byteLength));
	}

	// istanbul ignore if: should never happen
	if (!(this.body instanceof stream__WEBPACK_IMPORTED_MODULE_0__)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		_this4.body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		_this4.body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		_this4.body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__ && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Response or Request instance
 */
function extractContentType(instance) {
	const body = instance.body;

	// istanbul ignore if: Currently, because of a guard in Request, body
	// can never be null. Included here for completeness.

	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (body instanceof Blob) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else {
		// body is stream
		// can't really do much about this
		return null;
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;

	// istanbul ignore if: included for completion

	if (body === null) {
		// body is null
		return 0;
	} else if (typeof body === 'string') {
		// body is string
		return Buffer.byteLength(body);
	} else if (isURLSearchParams(body)) {
		// body is URLSearchParams
		return Buffer.byteLength(String(body));
	} else if (body instanceof Blob) {
		// body is blob
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return body.byteLength;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return body.byteLength;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		// can't really do much about this
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (typeof body === 'string') {
		// body is string
		dest.write(body);
		dest.end();
	} else if (isURLSearchParams(body)) {
		// body is URLSearchParams
		dest.write(Buffer.from(String(body)));
		dest.end();
	} else if (body instanceof Blob) {
		// body is blob
		dest.write(body[BUFFER]);
		dest.end();
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		dest.write(Buffer.from(body));
		dest.end();
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		dest.write(Buffer.from(body.buffer, body.byteOffset, body.byteLength));
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name)) {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__WEBPACK_IMPORTED_MODULE_1__.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers: new Headers(opts.headers)
		};
	}

	get url() {
		return this[INTERNALS$1].url;
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = url__WEBPACK_IMPORTED_MODULE_2__.parse;
const format_url = url__WEBPACK_IMPORTED_MODULE_2__.format;

const streamDestructionSupported = 'destroy' in stream__WEBPACK_IMPORTED_MODULE_0__.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (init.body != null) {
			const contentType = extractContentType(this);
			if (contentType !== null && !headers.has('Content-Type')) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof stream__WEBPACK_IMPORTED_MODULE_0__.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	if (!headers.has('Connection') && !request.agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent: request.agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = stream__WEBPACK_IMPORTED_MODULE_0__.PassThrough;
const resolve_url = url__WEBPACK_IMPORTED_MODULE_2__.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__WEBPACK_IMPORTED_MODULE_3__ : http__WEBPACK_IMPORTED_MODULE_1__).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof stream__WEBPACK_IMPORTED_MODULE_0__.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__WEBPACK_IMPORTED_MODULE_4__.Z_SYNC_FLUSH,
				finishFlush: zlib__WEBPACK_IMPORTED_MODULE_4__.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createInflate());
					} else {
						body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

/* harmony default export */ __webpack_exports__["default"] = (fetch);



/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file apiConfig.ts
 * @fileoverview - Exports an object literal with configuration information for
 *    the available OCAPI calls.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiConfig = {
    clientId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    clientPassword: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    resources: {
        /***************************************************************************
         * OCAPI : Data API
         * Resource : CustomObjectDefinitions
         **************************************************************************/
        customObjectDefinitions: {
            api: 'data',
            availableCalls: {
                /* ==================================================================
                 * GET ALL CUSTOM OBJECT DEFINITIONS
                 * ================================================================== */
                getAll: {
                    authorization: 'BM_USER',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET',
                    params: [
                        {
                            id: 'select',
                            type: 'string',
                            use: 'QUERY_PARAMETER'
                        }, {
                            id: 'count',
                            type: 'number',
                            use: 'QUERY_PARAMETER'
                        }
                    ],
                    // Use the system_object_definition endpoint with the filter to only
                    // get the custom object tyeps.
                    path: 'system_object_definitions',
                },
                /* ==================================================================
                 * GET A CUSTOM OBJECT DEFINITION & ATTRIBUTES
                 * ================================================================== */
                get: {
                    authorization: 'BM_USER',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET',
                    params: [
                        {
                            id: 'objectType',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }
                    ],
                    path: '/custom_object_definitions/{objectType}/attribute_definitions',
                },
                /* ==================================================================
                 * GET CUSTOM OBJECT ATTRIBUTES
                 * ================================================================== */
                getAttributes: {
                    authorization: 'BM_USER',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET',
                    params: [
                        {
                            id: 'select',
                            type: 'string',
                            use: 'QUERY_PARAMETER'
                        }, {
                            id: 'objectType',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }
                    ],
                    path: 'custom_object_definitions/{objectType}/attribute_definitions'
                }
            }
        },
        /***************************************************************************
         * OCAPI : Data API
         * Resource : SystemObjectDefinitions
         **************************************************************************/
        systemObjectDefinitions: {
            api: 'data',
            availableCalls: {
                /* ==================================================================
                 * GET SYSTEM OBJECT DEFINITION & ATTRIBUTES
                 * ================================================================== */
                get: {
                    authorization: 'BM_USER',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET',
                    params: [
                        {
                            id: 'objectType',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }
                    ],
                    path: 'system_object_definitions/{objectType}'
                },
                /* ==================================================================
                 * GET ALL SYSTEM OBJECT DEFINITIONS
                 * ================================================================== */
                getAll: {
                    authorization: 'BM_USER',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET',
                    params: [
                        {
                            id: 'select',
                            type: 'string',
                            use: 'QUERY_PARAMETER'
                        }, {
                            id: 'count',
                            type: 'number',
                            use: 'QUERY_PARAMETER'
                        }
                    ],
                    path: 'system_object_definitions',
                },
                /* ==================================================================
                 * GET SYSTEM OBJECT ATTRIBUTES
                 * ================================================================== */
                getAttributes: {
                    authorization: 'BM_USER',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET',
                    params: [
                        {
                            id: 'select',
                            type: 'string',
                            use: 'QUERY_PARAMETER'
                        }, {
                            id: 'objectType',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }
                    ],
                    path: 'system_object_definitions/{objectType}/attribute_definitions'
                },
                /* ==================================================================
                 * CREATE NEW ATTRIBUTE DEFINITION
                 * ================================================================== */
                createAttribute: {
                    authorization: 'BM_USER',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-dw-validate-existing': true,
                        'Accept': 'application/json'
                    },
                    method: 'PUT',
                    params: [
                        {
                            id: 'id',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }, {
                            id: 'objectType',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }
                    ],
                    path: 'system_object_definitions/{objectType}/attribute_definitions/{id}'
                },
                /* ==================================================================
                 * DELETE ATTRIBUTE DEFINITION
                 * ================================================================== */
                deleteAttribute: {
                    authorization: 'BM_USER',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-dw-validate-existing': true,
                        'Accept': 'application/json'
                    },
                    method: 'DELETE',
                    params: [
                        {
                            id: 'id',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }, {
                            id: 'objectType',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }
                    ],
                    path: 'system_object_definitions/{objectType}/attribute_definitions/{id}'
                },
                /* ==================================================================
                 * CREATE ATTRIBUTE GROUP
                 * ================================================================== */
                createAttributeGroup: {
                    authorization: 'BM_USER',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-dw-validate-existing': true,
                        'Accept': 'application/json'
                    },
                    method: 'PUT',
                    params: [
                        {
                            id: 'id',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }, {
                            id: 'objectType',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }
                    ],
                    path: 'system_object_definitions/{objectType}/attribute_groups/{id}'
                },
                /* ==================================================================
                 * GET ATTRIBUTE GROUPS
                 * ================================================================== */
                getAttributeGroups: {
                    authorization: 'BM_USER',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'GET',
                    params: [
                        {
                            id: 'select',
                            type: 'string',
                            use: 'QUERY_PARAMETER'
                        }, {
                            id: 'objectType',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }
                    ],
                    path: 'system_object_definitions/{objectType}/attribute_groups'
                },
                /* ==================================================================
                 * ADD ATTRIBUTE DEFINITION TO ATTRIBUTE GROUP
                 * ================================================================== */
                assignAttributeToGroup: {
                    authorization: 'BM_USER',
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PUT',
                    params: [
                        {
                            id: 'objectType',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }, {
                            id: 'groupId',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }, {
                            id: 'attributeId',
                            type: 'string',
                            use: 'PATH_PARAMETER'
                        }
                    ],
                    path: 'system_object_definitions/{objectType}/attribute_groups/{groupId}/attribute_definitions/{attributeId}'
                }
            }
        }
    },
    /*
     * -- Target API Version ---
     * This should be the same as the version number for wich the client ID access
     * assigned in your sandboxes OCAPI Configuration and should be in the same
     * format as it is in an OCAPI URL (i.e.: v18_8).
     */
    version: 'v18_8'
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file OAuth2Token.ts
 * @fileoverview - A class to hold an OAuth 2.0 access token.
 */
Object.defineProperty(exports, "__esModule", { value: true });
class OAuth2Token {
    constructor(args) {
        // Define class members and their default values.
        this.expiresIn = 0;
        this.tokenType = '';
        this.accessToken = '';
        this.timeCreated = 0;
        // Assign any instance values passed in at instantiation.
        if (args.expires_in) {
            this.expiresIn = args.expires_in;
        }
        if (args.token_type) {
            this.tokenType = args.token_type;
        }
        if (args.access_token) {
            this.accessToken = args.access_token;
        }
        this.timeCreated = Date.now();
    }
    isValid() {
        const timeNow = Date.now();
        if (timeNow - this.timeCreated > this.expiresIn * 1000) {
            return false;
        }
        return true;
    }
}
exports.OAuth2Token = OAuth2Token;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file ICallSetup.ts
 * @fileoverview - An interface that describes the arguments needed for the
 * constructor method of the CallSetup class.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var HTTP_VERB;
(function (HTTP_VERB) {
    HTTP_VERB["delete"] = "DELETE";
    HTTP_VERB["get"] = "GET";
    HTTP_VERB["patch"] = "PATCH";
    HTTP_VERB["post"] = "POST";
    HTTP_VERB["put"] = "PUT";
})(HTTP_VERB = exports.HTTP_VERB || (exports.HTTP_VERB = {}));


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file ObjectTypeDefinition.ts
 * @fileoverview - Provides a class for standardized handling of the OCAPI
 * object_type_definition document type.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class ObjectTypeDefinition
 * @classdesc - Provides a data class for working with the OCAPI Data API
 *    document type object_type_definition.
 */
class ObjectTypeDefinition {
    /**
     * @constructor
     * @param {object} [args] - A system_object_definition document returned from
     *    a call to the Open Commerce API.
     * @param {number} [args.attribute_definition_count] - The number of attribute
     *    definitions contained by the type. This is a computed attribute and
     *    cannot be changed.
     * @param {number} [args.attribute_group_count] - The number of attribute
     *    groups contained by the type. This is a computed attribute and cannot be
     *    changed.
     * @param {boolean} [args.content_object] - True if the object type definition
     *    is marked as a content object
     * @param {string} [args.description] - The user entered description for the
     *    type (localizable)
     * @param {string} [args.display_name] - The user entered display name
     *    (localizable).
     * @param {string} [args.link] - URL that is used to get this instance. This
     *    is a computed attribute and cannot be changed.
     * @param {string} [args.object_type] - The object type identifier.
     * @param {boolean} [args.queryable] - True if the system object type is
     *    queryable, false otherwise. Default is true.
     * @param {boolean} [args.read_only] - True if the system object is read-only,
     *    false otherwise. This is a computed attribute and cannot be changed.
     */
    constructor(args) {
        // Declare class member variable defaults.
        this.attributeDefinitionCount = 0;
        this.attributeGroupCount = 0;
        this.contentObject = false;
        this.description = '';
        this.displayName = '';
        this.link = '';
        this.objectType = '';
        this.queryable = true;
        this.readOnly = false;
        // Get any passed in property values and assign them to the class instance.
        if (args) {
            if (args.attribute_definition_count) {
                this.attributeDefinitionCount = args.attribute_definition_count;
            }
            if (args.attribute_group_count) {
                this.attributeGroupCount = args.attribute_group_count;
            }
            if (args.content_object) {
                this.contentObject = args.content_object;
            }
            if (args.description) {
                this.description = args.description;
            }
            if (args.display_name) {
                this.displayName = args.display_name;
            }
            if (args.link) {
                this.link = args.link;
            }
            if (args.object_type) {
                this.objectType = args.object_type;
            }
            if (args.queryable) {
                this.queryable = args.queryable;
            }
            if (args.read_only) {
                this.readOnly = args.read_only;
            }
        }
    }
}
exports.default = ObjectTypeDefinition;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file ObjectAttributeDefinition.ts
 * @fileoverview - Exports the ObjectAttributeDefinition class which is a model
 * for the OCAPI document representing an attribute definition of a system or
 * custom object.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectAttributeValueDefinition_1 = __webpack_require__(18);
/**
 * @class - Used for handling the OCAPI document: ObjectAttributeDefinition.
 * @param {Object} args - The raw JSON object document returned from a call to
 *      SFCC OCAPI.
 */
class ObjectAttributeDefinition {
    /**
     * @constructor
     * @param {Object} args - The raw JSON response object:
     *    object_attribute_value_definition.
     *
     * Notes:
     *  - Number values that default to -1 do so because they are integers. The -1
     *    value indicates that they have not been set.
     *  - The values for field_height and field_width are ignored only kept for
     *    use in the import and export files.
     */
    constructor(args) {
        // members that need to be renamed when sending the doc.
        this.MEMBER_MAP = {
            defaultValue: 'default_value',
            displayName: 'display_name',
            effectiveId: 'effective_id',
            externallyDefined: 'externally_defined',
            externallyManaged: 'externally_managed',
            fieldHeight: 'field_height',
            fieldWidth: 'field_width',
            maxValue: 'max_value',
            minLength: 'min_length',
            minValue: 'min_value',
            multiValueType: 'multi_value_type',
            orderRequired: 'order_required',
            readOnly: 'read_only',
            regularExpression: 'regular_expression',
            requiresEncoding: 'requires_encoding',
            setValueType: 'set_value_type',
            siteSpecific: 'site_specific',
            valueDefinitions: 'value_definitions',
            valueType: 'value_type'
        };
        this.defaultValue =
            new ObjectAttributeValueDefinition_1.default(args.default_value) ||
                new ObjectAttributeValueDefinition_1.default({});
        this.description = args.description || { default: '' };
        this.displayName = args.display_name || { default: '' };
        this.effectiveId = args.effective_id || '';
        this.externallyDefined = args.externally_defined || false;
        this.externallyManaged = args.externally_managed || false;
        this.id = args.id || '';
        this.key = args.key || false;
        this.link = args.link || '';
        this.localizable = args.localizable || false;
        this.mandatory = args.mandatory || false;
        this.maxValue = args.max_value || null;
        this.minLength = args.min_length || 0;
        this.minValue = args.min_value || null;
        this.multiValueType = args.multi_value_type || false;
        this.orderRequired = args.order_required || false;
        this.queryable = args.queryable || false;
        this.readOnly = args.read_only || false;
        this.regularExpression = args.regular_expression || '';
        this.requiresEncoding = args.requires_encoding || false;
        this.scale = args.scale || -1;
        this.searchable = args.searchable || false;
        this.setValueType = args.set_value_type || '';
        this.siteSpecific = args.site_specific || false;
        this.system = args.system || false;
        this.unit = args.unit || { default: '' };
        this.valueDefinitions = args.value_definitions || [];
        this.valueType = args.value_type || '';
        this.visible = args.visible || false;
        this.includedFields = args.includeFields || [];
    }
    /**
     * Gets a JSON string representation in the form of the OCAPI document.
     *
     * @param {string[]} [includeFields = []] - An optional argument to specify which
     *    class properties to include in the JSON string result. If empty, all of
     *    the class properties will be included. This is not ideal when updating
     *    because it will overwrite values for attribute properties that were
     *    previously set with the class defaults. In this case, specify only the
     *    fields that you are updating.
     * @return {string} - Returns a stringified JSON object representation of the
     *    OCAPI document class that can be submitted to the API methods.
     */
    getDocument(includeFields = []) {
        const documentObj = {};
        let memberNames = Object.keys(this).filter(key => typeof key !== 'function' &&
            key !== 'MEMBER_MAP' &&
            key !== 'includedFields');
        // If the fields to return were specified, then filter the array of
        // properties to assign to the new object literal.
        if (includeFields && includeFields.length) {
            memberNames = memberNames.filter(name => includeFields.indexOf(name) > -1);
        }
        else if (this.includedFields.length) {
            memberNames = memberNames.filter(name => this.includedFields.indexOf(name) > -1);
        }
        // Create a property on the results object.
        memberNames.forEach(localPropName => {
            const docPropName = localPropName in this.MEMBER_MAP ?
                this.MEMBER_MAP[localPropName] : localPropName;
            let localPropVal;
            if (typeof this[localPropName] !== 'undefined') {
                localPropVal = this[localPropName];
                const isComplexType = typeof localPropVal !== 'number' &&
                    typeof localPropVal !== 'string' &&
                    typeof localPropVal !== 'boolean';
                if (!isComplexType) {
                    documentObj[docPropName] = localPropVal;
                }
                else {
                    if (localPropVal instanceof ObjectAttributeValueDefinition_1.default) {
                        // ==> ObjectAttributeValueDefinition - this.defaultValue
                        documentObj[docPropName] = localPropVal.getDocument();
                    }
                    else if (Array.isArray(localPropVal)) {
                        // ==> Array<ObjectAttributeValueDefinition> - this.valueDefinitions
                        documentObj[docPropName] = localPropVal.length
                            ? localPropVal.map(arrayMember => {
                                // valueDefinitions is the only instance property that is an
                                // Array type.
                                if (arrayMember instanceof ObjectAttributeValueDefinition_1.default) {
                                    return arrayMember.getDocument();
                                }
                            })
                            : [];
                    }
                    else {
                        // ==> IOCAPITypes.ILocalizedString - this.description,
                        // this.displayName, & this.unit
                        documentObj[docPropName] = localPropVal;
                    }
                }
            }
        });
        return documentObj;
    }
}
exports.default = ObjectAttributeDefinition;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file ObjectAttributeValueDefinition.ts
 * @fileoverview - Exports a single data-model class that takes an OCAPI
 * ObectAttributeValueDefinition document result in the constructor and provides
 * a class with cammel-case named variables for use in the data provider class.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class ObjectAttributeValueDefinition
 * @classdesc - A data class for the OCAPI data API document type:
 *    - ObjectAttributeValueDefinition
 */
class ObjectAttributeValueDefinition {
    /**
     * A constructor function for initializing new instances of the class.
     * @param {Object} [args] - The raw JSON document object returned from a call
     *    to the Open Commerce API of type object_attribute_value_definition.
     * @constructor
     */
    constructor(args) {
        if (args) {
            this.description = args.description || { default: '' };
            this.displayValue = args.display_value || { default: '' };
            this.id = args.id || '';
            this.position = args.position || -1;
            this.value = args.value || {};
        }
    }
    /**
     * Gets a JSON string representation in the form of the OCAPI document.
     *
     * @param {string[]} [includeFields = []] - An optional argument to specify which
     *    class properties to include in the JSON string result. If empty, all of
     *    the class properties will be included. This is not ideal when updating
     *    because it will overwrite values for attribute properties that were
     *    previously set with the class defaults. In this case, specify only the
     *    fields that you are updating.
     * @return {Object} - Returns a JSON object representation of the OCAPI
     *    document class that can be submitted to the API methods.
     */
    getDocument(includeFields = []) {
        let result = {};
        return result;
    }
}
exports.default = ObjectAttributeValueDefinition;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file ObjectAttributeGroup.ts
 * @fileoverview - Exports the ObjectAttributeGroup class which is a model for the OCAPI
 * document representing an attribute group of a system or custom object.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectAttributeDefinition_1 = __webpack_require__(17);
/**
 * @class
 * @classdesc - Used for handling the OCAPI document: ObjectAttributeGroup.
 */
class ObjectAttributeGroup {
    /**
     * @param {Object} args - The raw JSON object document returned from a call to
     *    SFCC OCAPI.
     * @constructor
     */
    constructor(args) {
        // Class Member Fields
        this.attributeDefinitions = [];
        this.attributeDefinitionsCount = 0;
        this.description = '';
        this.displayName = '';
        this.id = '';
        this.internal = false;
        this.link = '';
        this.position = 0;
        this.includedFields = [];
        this.MEMBER_MAP = {
            attributeDefinitions: 'attribute_definitions',
            attributeDefinitionsCount: 'attribute_definitions_count',
            displayName: 'display_name'
        };
        if (args) {
            if (args.attribute_definitions) {
                this.attributeDefinitions = args.attribute_definitions.map(def => new ObjectAttributeDefinition_1.default(def));
            }
            if (args.attribute_definitions_count) {
                this.attributeDefinitionsCount = args.attribute_definitions_count;
            }
            if (args.description && args.description.default) {
                this.description = args.description.default;
            }
            if (args.display_name && args.display_name.default) {
                this.displayName = args.display_name.default;
            }
            if (args.id) {
                this.id = args.id;
            }
            if (args.internal) {
                this.internal = args.internal;
            }
            if (args.link) {
                this.link = args.link;
            }
            if (args.position) {
                this.position = args.position;
            }
        }
    }
    getDocument(includeFields = []) {
        const documentObj = {};
        let memberNames = Object.keys(this).filter(key => typeof key !== 'function' &&
            key !== 'MEMBER_MAP' &&
            key !== 'includedFields');
        // If the fields to return were specified, then filter the array of
        // properties to assign to the new object literal.
        if (includeFields && includeFields.length) {
            memberNames = memberNames.filter(name => includeFields.indexOf(name) > -1);
        }
        else if (this.includedFields.length) {
            memberNames = memberNames.filter(name => this.includedFields.indexOf(name) > -1);
        }
        // Create a property on the results object.
        memberNames.forEach(localPropName => {
            const docPropName = localPropName in this.MEMBER_MAP ?
                this.MEMBER_MAP[localPropName] : localPropName;
            let localPropVal;
            if (typeof this[localPropName] !== 'undefined') {
                localPropVal = this[localPropName];
                const isComplexType = typeof localPropVal !== 'number' &&
                    typeof localPropVal !== 'string' &&
                    typeof localPropVal !== 'boolean';
                if (!isComplexType) {
                    documentObj[docPropName] = localPropVal;
                }
                else {
                    if (localPropVal instanceof ObjectAttributeDefinition_1.default) {
                        // ==> ObjectAttributeValueDefinition - this.defaultValue
                        documentObj[docPropName] = localPropVal.getDocument();
                    }
                    else {
                        // ==> ILocalizedString - this.description & this.displayName
                        documentObj[docPropName] = localPropVal;
                    }
                }
            }
        });
        documentObj['_v'] = '18.8';
        return documentObj;
    }
}
exports.default = ObjectAttributeGroup;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * @file OCAPIHelper.ts
 * @fileoverview - Exports a single clsass for modeling the system object
 * attribute definitions, and interacting with the OCAPI service to add, modify,
 * and delete attribute definitions.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectAttributeDefinition_1 = __webpack_require__(17);
const OCAPIService_1 = __webpack_require__(5);
const vscode_1 = __webpack_require__(1);
const ObjectAttributeGroup_1 = __webpack_require__(19);
/**
 * @class OCAPIHelper
 * @classdesc - A class with static helper methods for assisting in making calls
 * to the SFCC Open Commerce API in order to read from and write too the system
 * object definitions used by the SFCC instance.
 */
class OCAPIHelper {
    /**
     * @param {MetadataView} metaView - The MetadataView class instance that can
     *    be used to read the seleted items in the MetadataViewProvider instance.
     */
    constructor(metaView) {
        this.service = new OCAPIService_1.OCAPIService();
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
    addAttributeDefiniton(objectType, attributeDefinition, includeDescription = false) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let _callSetup = null;
            let _callResult;
            const callData = {
                body: JSON.stringify(docObj),
                objectType: objectType,
                id: attributeDefinition.id
            };
            try {
                _callSetup = yield this.service.getCallSetup('systemObjectDefinitions', 'createAttribute', callData);
                _callResult = yield this.service.makeCall(_callSetup);
            }
            catch (e) {
                vscode_1.window.showErrorMessage('ERROR making call to OCAPI: ' + e.message);
            }
            return Promise.resolve(_callResult);
        });
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
    addAttributeGroupDefiniton(objectType, attributeGroup) {
        return __awaiter(this, void 0, void 0, function* () {
            let includeFields = ['displayName', 'description', 'id', 'position'];
            attributeGroup.position = 1.0;
            const docObj = attributeGroup.getDocument(includeFields);
            let _callSetup = null;
            let _callResult;
            const callData = {
                body: JSON.stringify(docObj),
                objectType: objectType,
                id: attributeGroup.id
            };
            try {
                _callSetup = yield this.service.getCallSetup('systemObjectDefinitions', 'createAttributeGroup', callData);
                _callResult = yield this.service.makeCall(_callSetup);
            }
            catch (e) {
                vscode_1.window.showErrorMessage('ERROR: Unable to add new attribute group', e.message);
            }
            return Promise.resolve(_callResult);
        });
    }
    /**
     * Presents the user with a selection box to choose which attribute group to
     * add the attribute to. Returns a promise that resolves with the selection.
     *
     * @param {string[]} groupIds - The attribute group Ids for the system object.
     * @returns {Promise<string>} - Returns a promise that resolves with the
     *    string Id of the selected attribute group as the data.
     */
    getGroupIdFromUser(groupIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenSource = new vscode_1.CancellationTokenSource();
            const cancelAddAttributeToken = tokenSource.token;
            const qpOptions = {
                placeHolder: 'Select the attribute group'
            };
            let attributeId = '';
            try {
                // Show a select option box to choose the attribute group.
                attributeId = yield vscode_1.window.showQuickPick(groupIds, qpOptions, cancelAddAttributeToken);
            }
            catch (e) {
                return Promise.reject('User Cancled Action');
            }
            return attributeId;
        });
    }
    /**
     * Validates that a string is an allowed Id for a SFCC SystemObject attribute.
     *
     * @param {string} id - The Id to validate against the SFCC criteria.
     * @returns {string|null} - Returns an error message if the reuslt was not
     *    valid, OR returns null if the result was valid.
     */
    validateAttributeId(id) {
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
    addAttributeNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a cancelation token instance to cancel the request when needed.
            const tokenSource = new vscode_1.CancellationTokenSource();
            const cancelAddAttributeToken = tokenSource.token;
            const objAttributeDefinition = new ObjectAttributeDefinition_1.default({});
            /**
             * @todo: Get display strings from a resource bundle.
             */
            // Get the system object from the current node.
            const systemObjectId = node.name;
            // Create options objects for the dialogs.
            const idInputOptions = {
                prompt: 'Enter Attribute Id:',
                validateInput: this.validateAttributeId
            };
            const displayNameInputOptions = {
                prompt: 'Enter Attribute Display Name:'
            };
            const qpOptions = {
                placeHolder: 'Select the type for the attribute'
            };
            const descriptionInputOptions = {
                prompt: 'Enter Attribute Description (Optional):'
            };
            /* Begin Form Wizard
               ====================================================================== */
            try {
                // Show an input box for the user to enter the Id for the new attribute.
                const attributeId = yield vscode_1.window.showInputBox(idInputOptions, cancelAddAttributeToken);
                // If the user cancels then the return is undefined.
                if (typeof attributeId === 'undefined') {
                    return Promise.reject({ error: false, cancelled: true });
                }
                // Show a select option box to choose what type the new attribute will be.
                let attributeType = yield vscode_1.window.showQuickPick(OCAPIHelper.ATTRIBUTE_TYPES, qpOptions, cancelAddAttributeToken);
                // If the user cancels, then exit the wizard.
                if (typeof attributeType === 'undefined') {
                    return Promise.reject({ error: false, cancelled: true });
                }
                if (OCAPIHelper.ATTRIBUTE_MAP[attributeType.toLowerCase()]) {
                    attributeType = OCAPIHelper.ATTRIBUTE_MAP[attributeType.toLowerCase()];
                }
                const displayName = yield vscode_1.window.showInputBox(displayNameInputOptions, cancelAddAttributeToken);
                // If the user cancels, then exit the wizard.
                if (typeof displayName === 'undefined') {
                    return Promise.reject({ error: false, cancelled: true });
                }
                const description = yield vscode_1.window.showInputBox(descriptionInputOptions, cancelAddAttributeToken);
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
            }
            catch (e) {
                console.log(e);
                return Promise.reject({
                    error: true,
                    cancelled: false,
                    errorObject: e
                });
            }
        });
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
    addAttributeGroup(node) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a cancelation token instance to cancel the request when needed.
            const tokenSource = new vscode_1.CancellationTokenSource();
            const cancelAddGroupToken = tokenSource.token;
            const attributeGroup = new ObjectAttributeGroup_1.default({});
            const objectType = node.objectTypeDefinition.objectType;
            const getIdOptions = {
                prompt: 'Group Id: ',
                validateInput: this.validateAttributeId
            };
            const getDisplayNameOptions = {
                prompt: 'Display Name: '
            };
            const getDescriptionOptions = {
                prompt: 'Group Description: '
            };
            /* ======================================================================
             * Begin Form Wizard
             * ====================================================================== */
            try {
                // Get ID
                const attrGroupId = yield vscode_1.window.showInputBox(getIdOptions, cancelAddGroupToken);
                // Handle user cancellation
                if (typeof attrGroupId === 'undefined') {
                    return Promise.reject({ error: false, cancelled: true });
                }
                // Assign the new attribute to the OCAPI request document.
                attributeGroup.id = attrGroupId;
                // Get Attribute Group display name
                const attrGroupDisplayName = yield vscode_1.window.showInputBox(getDisplayNameOptions, cancelAddGroupToken);
                // Handle User Cancellation
                if (typeof attrGroupDisplayName === 'undefined') {
                    return Promise.reject({ error: false, cancelled: true });
                }
                // Assign to new attribute group instance.
                attributeGroup.displayName = attrGroupDisplayName;
                // Get Attribute Group display name
                const attrGroupDescription = yield vscode_1.window.showInputBox(getDescriptionOptions, cancelAddGroupToken);
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
            }
            catch (e) {
                console.log(e);
                Promise.reject({ error: true, cancelled: false, errorObject: e });
            }
        });
    }
    /**
     * Assings the speciifecd attribute definitions to the specified attribute
     * group using a call to the OCAPIService.
     *
     * @param node - An array of selected MetadataNodes
     */
    assignAttributesToGroup(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = node.parentId.split('.');
            const objectType = path[path.length - 2];
            let availableGroups = [];
            let _callSetup;
            let _callResult;
            // First, get the attribute groups to display as choices.
            try {
                _callSetup = yield this.service.getCallSetup('systemObjectDefinitions', 'getAttributeGroups', {
                    select: '(**)',
                    objectType: objectType
                });
                _callResult = yield this.service.makeCall(_callSetup);
                // If the API call returns data create the first level of a tree.
                if (!_callResult.error &&
                    typeof _callResult.data !== 'undefined' &&
                    Array.isArray(_callResult.data)) {
                    availableGroups = _callResult.data.map(group => group.id);
                    const assignGroupId = yield this.getGroupIdFromUser(availableGroups);
                    _callSetup = yield this.service.getCallSetup('systemObjectDefinitions', 'assignAttributeToGroup', {
                        objectType: objectType,
                        groupId: assignGroupId,
                        attributeId: node.objectAttributeDefinition.id
                    });
                    return yield this.service.makeCall(_callSetup);
                }
                else if (!_callResult.error &&
                    typeof _callResult.count !== 'undefined' &&
                    _callResult.count === 0) {
                    const errMsg = 'There are no attribute groups.';
                    vscode_1.window.showErrorMessage(errMsg);
                    Promise.reject(errMsg);
                }
            }
            catch (e) {
                const errMsg = 'Unable to assign attribute to group: ';
                console.log(errMsg + e.message);
                vscode_1.window.showErrorMessage('Unable to assign attribute to group.');
                return Promise.reject();
            }
            return Promise.reject('ERROR: Unable to assign attribute to group.');
        });
    }
    /**
     * Deletes the selected attribute definition from the system object.
     *
     * @param {MetadataNode} node - The selected tree node instance.
     * @returns {Promise<any>} - Returns a Promise that resolves to a results
     *    object from the API call.
     */
    deleteAttributeDefinition(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = node.parentId.split('.');
            const objectType = path[path.length - 2];
            const attributeId = node.objectAttributeDefinition.id;
            let _callSetup;
            try {
                _callSetup = yield this.service.getCallSetup('systemObjectDefinitions', 'deleteAttribute', {
                    objectType: objectType,
                    id: attributeId
                });
                return yield this.service.makeCall(_callSetup);
            }
            catch (e) {
                console.log(e);
                // If there was an error, return the error message for display.
                return Promise.reject('ERROR occured while deleting the attribute.');
            }
        });
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
    setDefaultAttributeValue(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const ALLOWED_SYSTEM_OBJECTS = [
                'SitePreferences',
                'OrganizationPreferences'
            ];
            const ALLOWED_ATTRIBUTE_TYPES = ['string', 'number', 'boolean'];
            const attributeDefinition = node.objectAttributeDefinition;
            let isCallAllowed = ALLOWED_SYSTEM_OBJECTS.some(type => 'root.systemObjectDefinitions.' + type === node.parentId);
            // Check if this is a system object that allows for default attribute values,
            // and that the data type allows for default values.
            if (isCallAllowed &&
                ALLOWED_ATTRIBUTE_TYPES.indexOf(attributeDefinition.valueType) > -1) {
                /** @todo make call to the OCAPI api to set the default value */
            }
            return Promise.reject('METHOD NOT IMPLEMENTED');
        });
    }
}
/**
 * Expected values in OCAPI call are:
 *  - image, boolean, money, quantity,
 *    password, set_of_string, set_of_int, set_of_double, unknown
 */
OCAPIHelper.ATTRIBUTE_TYPES = [
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
OCAPIHelper.ATTRIBUTE_MAP = {
    'integer': 'int',
    'number': 'double',
    'date + time': 'datetime',
    'enum of integers': 'enum_of_int',
    'enum of strings': 'enum_of_string',
    'set of integers': 'set_of_int',
    'set of numbers': 'set_of_double',
    'set of strings': 'set_of_string'
};
exports.default = OCAPIHelper;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(1);
/**
 * @file XMLHandler.ts
 * @fileoverview - Exports a class that can be used for handling XML and
 *    building and parsing XML strings for generating SFCC schema XML.
 */
/**
 * @class XMLHandler
 * @classdesc - The XMLHandler class can be instantiated for generating XML
 *    from SFCC system object & attribute definitions.
 */
class XMLHandler {
    /**
     * @constructor
     */
    constructor() {
        /* Class imports */
        this.xmlLib = __webpack_require__(22);
        /** @todo: Setup Instance */
    }
    /* ========================================================================
     * Private Helper Functions
     * ======================================================================== */
    /**
     * Gets the XML node for an ObjectAttributeDefinition class instance.
     *
     * @private
     * @param {Object} rootNode - The root node that can be used for building the
     *    necessary child XML.
     * @param {string} systemObjectType - The system object that the attribute
     *    will be added to.
     * @param {ObjectAttributeDefinition} attribute - The ObjectAttributeDefinition
     *    class instance to derive the XML data from.
     */
    getObjectAttributeXML(rootNode, systemObjectType, attribute) {
        const valType = attribute.valueType.toLocaleLowerCase();
        // Create the XML tree.
        const attrDefsNode = rootNode
            .ele('type-extension', { 'type-id': systemObjectType })
            .ele('custom-attribute-definitions');
        // Create the attribute definition node.
        const attrDefNode = attrDefsNode.ele('attribute-definition', {
            'attribute-id': attribute.id
        });
        // Define the attribute properties.
        attrDefNode.ele('display-name', { 'xml:lang': 'x-default' }, attribute.displayName.default);
        attrDefNode.ele('description', { 'xml:lang': 'x-default' }, attribute.description.default);
        attrDefNode.ele('type', attribute.valueType);
        attrDefNode.ele('mandatory-flag', attribute.mandatory);
        attrDefNode.ele('externally-managed-flag', attribute.externallyManaged);
        /**
         * Define properties that are specific to certain value types.
         */
        if (valType === 'string') {
            // Default type is 'string'
            attrDefNode.ele({ 'min-length': attribute.minLength });
        }
        else if (valType.indexOf('enum') > -1 &&
            attribute.valueDefinitions.length) {
            const valDefs = attrDefNode.ele('value-definitions');
            // Add any value-definitions that are configured for the attribute.
            attribute.valueDefinitions.forEach(function (valDef) {
                if (valDef.displayValue && valDef.value) {
                    const valDefXML = valDefs.ele('value-definition');
                    valDefXML.ele('display', { 'xml:lang': 'x-default' }, valDef.displayValue.default);
                    valDefXML.ele('value', valDef.value.toString());
                }
            });
        }
        /**
         * Define properties specific to system object types
         */
        switch (systemObjectType) {
            case 'Product':
                attrDefNode.ele('localizable-flag', attribute.localizable);
                attrDefNode.ele('site-specific-flag', attribute.siteSpecific);
                attrDefNode.ele('visible-flag', attribute.visible);
                attrDefNode.ele('order-required-flag', attribute.orderRequired);
                attrDefNode.ele('externally-defined-flag', attribute.externallyDefined);
                break;
            default:
                break;
        }
    }
    /* ========================================================================
     * Public Exported Methods
     * ======================================================================== */
    /**
     * Gets the XML representation of the Metanode, creates a blank file, and
     * populates the file with the generated XML.
     *
     * @param {MetadataNode} metaNode - The metadata node that represents the SFCC
     *    meta object to get the XML representation of.
     * @returns {Promise<TextEditor>} - Returns a promise that resolves to the
     *    TextDocument instance.
     */
    getXMLFromNode(metaNode) {
        return __awaiter(this, void 0, void 0, function* () {
            const systemObjectType = metaNode.parentId.split('.').pop();
            // Create the XML document in memory for modification.
            const rootNode = new this.xmlLib.create('metadata', {
                encoding: 'utf-8'
            }).att('xmlns', XMLHandler.NAMESPACE_STRING);
            if (metaNode.nodeType === 'objectAttributeDefinition') {
                const attribute = metaNode.objectAttributeDefinition;
                this.getObjectAttributeXML(rootNode, systemObjectType, attribute);
            }
            // Create the text document and show in the editor.
            vscode_1.workspace
                .openTextDocument({
                language: 'xml',
                content: rootNode.end({ allowEmpty: false, pretty: true })
            })
                .then(doc => {
                vscode_1.window.showTextDocument(doc);
            });
        });
    }
}
/* Instance members */
XMLHandler.NAMESPACE_STRING = 'http://www.demandware.com/xml/impex/metadata/2006-10-31';
exports.default = XMLHandler;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, WriterState, XMLDOMImplementation, XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;

  ref = __webpack_require__(23), assign = ref.assign, isFunction = ref.isFunction;

  XMLDOMImplementation = __webpack_require__(24);

  XMLDocument = __webpack_require__(25);

  XMLDocumentCB = __webpack_require__(53);

  XMLStringWriter = __webpack_require__(50);

  XMLStreamWriter = __webpack_require__(54);

  NodeType = __webpack_require__(31);

  WriterState = __webpack_require__(52);

  module.exports.create = function(name, xmldec, doctype, options) {
    var doc, root;
    if (name == null) {
      throw new Error("Root element needs a name.");
    }
    options = assign({}, xmldec, doctype, options);
    doc = new XMLDocument(options);
    root = doc.element(name);
    if (!options.headless) {
      doc.declaration(options);
      if ((options.pubID != null) || (options.sysID != null)) {
        doc.dtd(options);
      }
    }
    return root;
  };

  module.exports.begin = function(options, onData, onEnd) {
    var ref1;
    if (isFunction(options)) {
      ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
      options = {};
    }
    if (onData) {
      return new XMLDocumentCB(options, onData, onEnd);
    } else {
      return new XMLDocument(options);
    }
  };

  module.exports.stringWriter = function(options) {
    return new XMLStringWriter(options);
  };

  module.exports.streamWriter = function(stream, options) {
    return new XMLStreamWriter(stream, options);
  };

  module.exports.implementation = new XMLDOMImplementation();

  module.exports.nodeType = NodeType;

  module.exports.writerState = WriterState;

}).call(this);


/***/ }),
/* 23 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject,
    slice = [].slice,
    hasProp = {}.hasOwnProperty;

  assign = function() {
    var i, key, len, source, sources, target;
    target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (isFunction(Object.assign)) {
      Object.assign.apply(null, arguments);
    } else {
      for (i = 0, len = sources.length; i < len; i++) {
        source = sources[i];
        if (source != null) {
          for (key in source) {
            if (!hasProp.call(source, key)) continue;
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };

  isFunction = function(val) {
    return !!val && Object.prototype.toString.call(val) === '[object Function]';
  };

  isObject = function(val) {
    var ref;
    return !!val && ((ref = typeof val) === 'function' || ref === 'object');
  };

  isArray = function(val) {
    if (isFunction(Array.isArray)) {
      return Array.isArray(val);
    } else {
      return Object.prototype.toString.call(val) === '[object Array]';
    }
  };

  isEmpty = function(val) {
    var key;
    if (isArray(val)) {
      return !val.length;
    } else {
      for (key in val) {
        if (!hasProp.call(val, key)) continue;
        return false;
      }
      return true;
    }
  };

  isPlainObject = function(val) {
    var ctor, proto;
    return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && (typeof ctor === 'function') && (ctor instanceof ctor) && (Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object));
  };

  getValue = function(obj) {
    if (isFunction(obj.valueOf)) {
      return obj.valueOf();
    } else {
      return obj;
    }
  };

  module.exports.assign = assign;

  module.exports.isFunction = isFunction;

  module.exports.isObject = isObject;

  module.exports.isArray = isArray;

  module.exports.isEmpty = isEmpty;

  module.exports.isPlainObject = isPlainObject;

  module.exports.getValue = getValue;

}).call(this);


/***/ }),
/* 24 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDOMImplementation;

  module.exports = XMLDOMImplementation = (function() {
    function XMLDOMImplementation() {}

    XMLDOMImplementation.prototype.hasFeature = function(feature, version) {
      return true;
    };

    XMLDOMImplementation.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLDOMImplementation.prototype.createDocument = function(namespaceURI, qualifiedName, doctype) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLDOMImplementation.prototype.createHTMLDocument = function(title) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLDOMImplementation.prototype.getFeature = function(feature, version) {
      throw new Error("This DOM method is not implemented.");
    };

    return XMLDOMImplementation;

  })();

}).call(this);


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDOMConfiguration, XMLDOMImplementation, XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isPlainObject = __webpack_require__(23).isPlainObject;

  XMLDOMImplementation = __webpack_require__(24);

  XMLDOMConfiguration = __webpack_require__(26);

  XMLNode = __webpack_require__(29);

  NodeType = __webpack_require__(31);

  XMLStringifier = __webpack_require__(49);

  XMLStringWriter = __webpack_require__(50);

  module.exports = XMLDocument = (function(superClass) {
    extend(XMLDocument, superClass);

    function XMLDocument(options) {
      XMLDocument.__super__.constructor.call(this, null);
      this.name = "#document";
      this.type = NodeType.Document;
      this.documentURI = null;
      this.domConfig = new XMLDOMConfiguration();
      options || (options = {});
      if (!options.writer) {
        options.writer = new XMLStringWriter();
      }
      this.options = options;
      this.stringify = new XMLStringifier(options);
    }

    Object.defineProperty(XMLDocument.prototype, 'implementation', {
      value: new XMLDOMImplementation()
    });

    Object.defineProperty(XMLDocument.prototype, 'doctype', {
      get: function() {
        var child, i, len, ref;
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (child.type === NodeType.DocType) {
            return child;
          }
        }
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'documentElement', {
      get: function() {
        return this.rootObject || null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'inputEncoding', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'strictErrorChecking', {
      get: function() {
        return false;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'xmlEncoding', {
      get: function() {
        if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
          return this.children[0].encoding;
        } else {
          return null;
        }
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'xmlStandalone', {
      get: function() {
        if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
          return this.children[0].standalone === 'yes';
        } else {
          return false;
        }
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'xmlVersion', {
      get: function() {
        if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
          return this.children[0].version;
        } else {
          return "1.0";
        }
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'URL', {
      get: function() {
        return this.documentURI;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'origin', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'compatMode', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'characterSet', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDocument.prototype, 'contentType', {
      get: function() {
        return null;
      }
    });

    XMLDocument.prototype.end = function(writer) {
      var writerOptions;
      writerOptions = {};
      if (!writer) {
        writer = this.options.writer;
      } else if (isPlainObject(writer)) {
        writerOptions = writer;
        writer = this.options.writer;
      }
      return writer.document(this, writer.filterOptions(writerOptions));
    };

    XMLDocument.prototype.toString = function(options) {
      return this.options.writer.document(this, this.options.writer.filterOptions(options));
    };

    XMLDocument.prototype.createElement = function(tagName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createDocumentFragment = function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createTextNode = function(data) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createComment = function(data) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createCDATASection = function(data) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createProcessingInstruction = function(target, data) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createAttribute = function(name) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createEntityReference = function(name) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.getElementsByTagName = function(tagname) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.importNode = function(importedNode, deep) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createElementNS = function(namespaceURI, qualifiedName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.getElementById = function(elementId) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.adoptNode = function(source) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.normalizeDocument = function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.renameNode = function(node, namespaceURI, qualifiedName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.getElementsByClassName = function(classNames) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createEvent = function(eventInterface) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createRange = function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createNodeIterator = function(root, whatToShow, filter) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLDocument.prototype.createTreeWalker = function(root, whatToShow, filter) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    return XMLDocument;

  })(XMLNode);

}).call(this);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDOMConfiguration, XMLDOMErrorHandler, XMLDOMStringList;

  XMLDOMErrorHandler = __webpack_require__(27);

  XMLDOMStringList = __webpack_require__(28);

  module.exports = XMLDOMConfiguration = (function() {
    function XMLDOMConfiguration() {
      var clonedSelf;
      this.defaultParams = {
        "canonical-form": false,
        "cdata-sections": false,
        "comments": false,
        "datatype-normalization": false,
        "element-content-whitespace": true,
        "entities": true,
        "error-handler": new XMLDOMErrorHandler(),
        "infoset": true,
        "validate-if-schema": false,
        "namespaces": true,
        "namespace-declarations": true,
        "normalize-characters": false,
        "schema-location": '',
        "schema-type": '',
        "split-cdata-sections": true,
        "validate": false,
        "well-formed": true
      };
      this.params = clonedSelf = Object.create(this.defaultParams);
    }

    Object.defineProperty(XMLDOMConfiguration.prototype, 'parameterNames', {
      get: function() {
        return new XMLDOMStringList(Object.keys(this.defaultParams));
      }
    });

    XMLDOMConfiguration.prototype.getParameter = function(name) {
      if (this.params.hasOwnProperty(name)) {
        return this.params[name];
      } else {
        return null;
      }
    };

    XMLDOMConfiguration.prototype.canSetParameter = function(name, value) {
      return true;
    };

    XMLDOMConfiguration.prototype.setParameter = function(name, value) {
      if (value != null) {
        return this.params[name] = value;
      } else {
        return delete this.params[name];
      }
    };

    return XMLDOMConfiguration;

  })();

}).call(this);


/***/ }),
/* 27 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDOMErrorHandler;

  module.exports = XMLDOMErrorHandler = (function() {
    function XMLDOMErrorHandler() {}

    XMLDOMErrorHandler.prototype.handleError = function(error) {
      throw new Error(error);
    };

    return XMLDOMErrorHandler;

  })();

}).call(this);


/***/ }),
/* 28 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLDOMStringList;

  module.exports = XMLDOMStringList = (function() {
    function XMLDOMStringList(arr) {
      this.arr = arr || [];
    }

    Object.defineProperty(XMLDOMStringList.prototype, 'length', {
      get: function() {
        return this.arr.length;
      }
    });

    XMLDOMStringList.prototype.item = function(index) {
      return this.arr[index] || null;
    };

    XMLDOMStringList.prototype.contains = function(str) {
      return this.arr.indexOf(str) !== -1;
    };

    return XMLDOMStringList;

  })();

}).call(this);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var DocumentPosition, NodeType, XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNamedNodeMap, XMLNode, XMLNodeList, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref1,
    hasProp = {}.hasOwnProperty;

  ref1 = __webpack_require__(23), isObject = ref1.isObject, isFunction = ref1.isFunction, isEmpty = ref1.isEmpty, getValue = ref1.getValue;

  XMLElement = null;

  XMLCData = null;

  XMLComment = null;

  XMLDeclaration = null;

  XMLDocType = null;

  XMLRaw = null;

  XMLText = null;

  XMLProcessingInstruction = null;

  XMLDummy = null;

  NodeType = null;

  XMLNodeList = null;

  XMLNamedNodeMap = null;

  DocumentPosition = null;

  module.exports = XMLNode = (function() {
    function XMLNode(parent1) {
      this.parent = parent1;
      if (this.parent) {
        this.options = this.parent.options;
        this.stringify = this.parent.stringify;
      }
      this.value = null;
      this.children = [];
      this.baseURI = null;
      if (!XMLElement) {
        XMLElement = __webpack_require__(30);
        XMLCData = __webpack_require__(34);
        XMLComment = __webpack_require__(36);
        XMLDeclaration = __webpack_require__(37);
        XMLDocType = __webpack_require__(38);
        XMLRaw = __webpack_require__(43);
        XMLText = __webpack_require__(44);
        XMLProcessingInstruction = __webpack_require__(45);
        XMLDummy = __webpack_require__(46);
        NodeType = __webpack_require__(31);
        XMLNodeList = __webpack_require__(47);
        XMLNamedNodeMap = __webpack_require__(33);
        DocumentPosition = __webpack_require__(48);
      }
    }

    Object.defineProperty(XMLNode.prototype, 'nodeName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'nodeType', {
      get: function() {
        return this.type;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'nodeValue', {
      get: function() {
        return this.value;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'parentNode', {
      get: function() {
        return this.parent;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'childNodes', {
      get: function() {
        if (!this.childNodeList || !this.childNodeList.nodes) {
          this.childNodeList = new XMLNodeList(this.children);
        }
        return this.childNodeList;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'firstChild', {
      get: function() {
        return this.children[0] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'lastChild', {
      get: function() {
        return this.children[this.children.length - 1] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'previousSibling', {
      get: function() {
        var i;
        i = this.parent.children.indexOf(this);
        return this.parent.children[i - 1] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'nextSibling', {
      get: function() {
        var i;
        i = this.parent.children.indexOf(this);
        return this.parent.children[i + 1] || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'ownerDocument', {
      get: function() {
        return this.document() || null;
      }
    });

    Object.defineProperty(XMLNode.prototype, 'textContent', {
      get: function() {
        var child, j, len, ref2, str;
        if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
          str = '';
          ref2 = this.children;
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            if (child.textContent) {
              str += child.textContent;
            }
          }
          return str;
        } else {
          return null;
        }
      },
      set: function(value) {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    XMLNode.prototype.setParent = function(parent) {
      var child, j, len, ref2, results;
      this.parent = parent;
      if (parent) {
        this.options = parent.options;
        this.stringify = parent.stringify;
      }
      ref2 = this.children;
      results = [];
      for (j = 0, len = ref2.length; j < len; j++) {
        child = ref2[j];
        results.push(child.setParent(this));
      }
      return results;
    };

    XMLNode.prototype.element = function(name, attributes, text) {
      var childNode, item, j, k, key, lastChild, len, len1, ref2, ref3, val;
      lastChild = null;
      if (attributes === null && (text == null)) {
        ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
      }
      if (attributes == null) {
        attributes = {};
      }
      attributes = getValue(attributes);
      if (!isObject(attributes)) {
        ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
      }
      if (name != null) {
        name = getValue(name);
      }
      if (Array.isArray(name)) {
        for (j = 0, len = name.length; j < len; j++) {
          item = name[j];
          lastChild = this.element(item);
        }
      } else if (isFunction(name)) {
        lastChild = this.element(name.apply());
      } else if (isObject(name)) {
        for (key in name) {
          if (!hasProp.call(name, key)) continue;
          val = name[key];
          if (isFunction(val)) {
            val = val.apply();
          }
          if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
            lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
          } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
            lastChild = this.dummy();
          } else if (isObject(val) && isEmpty(val)) {
            lastChild = this.element(key);
          } else if (!this.options.keepNullNodes && (val == null)) {
            lastChild = this.dummy();
          } else if (!this.options.separateArrayItems && Array.isArray(val)) {
            for (k = 0, len1 = val.length; k < len1; k++) {
              item = val[k];
              childNode = {};
              childNode[key] = item;
              lastChild = this.element(childNode);
            }
          } else if (isObject(val)) {
            if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
              lastChild = this.element(val);
            } else {
              lastChild = this.element(key);
              lastChild.element(val);
            }
          } else {
            lastChild = this.element(key, val);
          }
        }
      } else if (!this.options.keepNullNodes && text === null) {
        lastChild = this.dummy();
      } else {
        if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
          lastChild = this.text(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
          lastChild = this.cdata(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
          lastChild = this.comment(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
          lastChild = this.raw(text);
        } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
          lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
        } else {
          lastChild = this.node(name, attributes, text);
        }
      }
      if (lastChild == null) {
        throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
      }
      return lastChild;
    };

    XMLNode.prototype.insertBefore = function(name, attributes, text) {
      var child, i, newChild, refChild, removed;
      if (name != null ? name.type : void 0) {
        newChild = name;
        refChild = attributes;
        newChild.setParent(this);
        if (refChild) {
          i = children.indexOf(refChild);
          removed = children.splice(i);
          children.push(newChild);
          Array.prototype.push.apply(children, removed);
        } else {
          children.push(newChild);
        }
        return newChild;
      } else {
        if (this.isRoot) {
          throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
        }
        i = this.parent.children.indexOf(this);
        removed = this.parent.children.splice(i);
        child = this.parent.element(name, attributes, text);
        Array.prototype.push.apply(this.parent.children, removed);
        return child;
      }
    };

    XMLNode.prototype.insertAfter = function(name, attributes, text) {
      var child, i, removed;
      if (this.isRoot) {
        throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
      }
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.element(name, attributes, text);
      Array.prototype.push.apply(this.parent.children, removed);
      return child;
    };

    XMLNode.prototype.remove = function() {
      var i, ref2;
      if (this.isRoot) {
        throw new Error("Cannot remove the root element. " + this.debugInfo());
      }
      i = this.parent.children.indexOf(this);
      [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref2 = [])), ref2;
      return this.parent;
    };

    XMLNode.prototype.node = function(name, attributes, text) {
      var child, ref2;
      if (name != null) {
        name = getValue(name);
      }
      attributes || (attributes = {});
      attributes = getValue(attributes);
      if (!isObject(attributes)) {
        ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
      }
      child = new XMLElement(this, name, attributes);
      if (text != null) {
        child.text(text);
      }
      this.children.push(child);
      return child;
    };

    XMLNode.prototype.text = function(value) {
      var child;
      if (isObject(value)) {
        this.element(value);
      }
      child = new XMLText(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.cdata = function(value) {
      var child;
      child = new XMLCData(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.comment = function(value) {
      var child;
      child = new XMLComment(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.commentBefore = function(value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.comment(value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.commentAfter = function(value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.comment(value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.raw = function(value) {
      var child;
      child = new XMLRaw(this, value);
      this.children.push(child);
      return this;
    };

    XMLNode.prototype.dummy = function() {
      var child;
      child = new XMLDummy(this);
      return child;
    };

    XMLNode.prototype.instruction = function(target, value) {
      var insTarget, insValue, instruction, j, len;
      if (target != null) {
        target = getValue(target);
      }
      if (value != null) {
        value = getValue(value);
      }
      if (Array.isArray(target)) {
        for (j = 0, len = target.length; j < len; j++) {
          insTarget = target[j];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) {
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        instruction = new XMLProcessingInstruction(this, target, value);
        this.children.push(instruction);
      }
      return this;
    };

    XMLNode.prototype.instructionBefore = function(target, value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i);
      child = this.parent.instruction(target, value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.instructionAfter = function(target, value) {
      var child, i, removed;
      i = this.parent.children.indexOf(this);
      removed = this.parent.children.splice(i + 1);
      child = this.parent.instruction(target, value);
      Array.prototype.push.apply(this.parent.children, removed);
      return this;
    };

    XMLNode.prototype.declaration = function(version, encoding, standalone) {
      var doc, xmldec;
      doc = this.document();
      xmldec = new XMLDeclaration(doc, version, encoding, standalone);
      if (doc.children.length === 0) {
        doc.children.unshift(xmldec);
      } else if (doc.children[0].type === NodeType.Declaration) {
        doc.children[0] = xmldec;
      } else {
        doc.children.unshift(xmldec);
      }
      return doc.root() || doc;
    };

    XMLNode.prototype.dtd = function(pubID, sysID) {
      var child, doc, doctype, i, j, k, len, len1, ref2, ref3;
      doc = this.document();
      doctype = new XMLDocType(doc, pubID, sysID);
      ref2 = doc.children;
      for (i = j = 0, len = ref2.length; j < len; i = ++j) {
        child = ref2[i];
        if (child.type === NodeType.DocType) {
          doc.children[i] = doctype;
          return doctype;
        }
      }
      ref3 = doc.children;
      for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
        child = ref3[i];
        if (child.isRoot) {
          doc.children.splice(i, 0, doctype);
          return doctype;
        }
      }
      doc.children.push(doctype);
      return doctype;
    };

    XMLNode.prototype.up = function() {
      if (this.isRoot) {
        throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
      }
      return this.parent;
    };

    XMLNode.prototype.root = function() {
      var node;
      node = this;
      while (node) {
        if (node.type === NodeType.Document) {
          return node.rootObject;
        } else if (node.isRoot) {
          return node;
        } else {
          node = node.parent;
        }
      }
    };

    XMLNode.prototype.document = function() {
      var node;
      node = this;
      while (node) {
        if (node.type === NodeType.Document) {
          return node;
        } else {
          node = node.parent;
        }
      }
    };

    XMLNode.prototype.end = function(options) {
      return this.document().end(options);
    };

    XMLNode.prototype.prev = function() {
      var i;
      i = this.parent.children.indexOf(this);
      if (i < 1) {
        throw new Error("Already at the first node. " + this.debugInfo());
      }
      return this.parent.children[i - 1];
    };

    XMLNode.prototype.next = function() {
      var i;
      i = this.parent.children.indexOf(this);
      if (i === -1 || i === this.parent.children.length - 1) {
        throw new Error("Already at the last node. " + this.debugInfo());
      }
      return this.parent.children[i + 1];
    };

    XMLNode.prototype.importDocument = function(doc) {
      var clonedRoot;
      clonedRoot = doc.root().clone();
      clonedRoot.parent = this;
      clonedRoot.isRoot = false;
      this.children.push(clonedRoot);
      return this;
    };

    XMLNode.prototype.debugInfo = function(name) {
      var ref2, ref3;
      name = name || this.name;
      if ((name == null) && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
        return "";
      } else if (name == null) {
        return "parent: <" + this.parent.name + ">";
      } else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
        return "node: <" + name + ">";
      } else {
        return "node: <" + name + ">, parent: <" + this.parent.name + ">";
      }
    };

    XMLNode.prototype.ele = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.nod = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.txt = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLNode.prototype.doc = function() {
      return this.document();
    };

    XMLNode.prototype.dec = function(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    };

    XMLNode.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLNode.prototype.n = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLNode.prototype.t = function(value) {
      return this.text(value);
    };

    XMLNode.prototype.d = function(value) {
      return this.cdata(value);
    };

    XMLNode.prototype.c = function(value) {
      return this.comment(value);
    };

    XMLNode.prototype.r = function(value) {
      return this.raw(value);
    };

    XMLNode.prototype.i = function(target, value) {
      return this.instruction(target, value);
    };

    XMLNode.prototype.u = function() {
      return this.up();
    };

    XMLNode.prototype.importXMLBuilder = function(doc) {
      return this.importDocument(doc);
    };

    XMLNode.prototype.replaceChild = function(newChild, oldChild) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.removeChild = function(oldChild) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.appendChild = function(newChild) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.hasChildNodes = function() {
      return this.children.length !== 0;
    };

    XMLNode.prototype.cloneNode = function(deep) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.normalize = function() {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.isSupported = function(feature, version) {
      return true;
    };

    XMLNode.prototype.hasAttributes = function() {
      return this.attribs.length !== 0;
    };

    XMLNode.prototype.compareDocumentPosition = function(other) {
      var ref, res;
      ref = this;
      if (ref === other) {
        return 0;
      } else if (this.document() !== other.document()) {
        res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
        if (Math.random() < 0.5) {
          res |= DocumentPosition.Preceding;
        } else {
          res |= DocumentPosition.Following;
        }
        return res;
      } else if (ref.isAncestor(other)) {
        return DocumentPosition.Contains | DocumentPosition.Preceding;
      } else if (ref.isDescendant(other)) {
        return DocumentPosition.Contains | DocumentPosition.Following;
      } else if (ref.isPreceding(other)) {
        return DocumentPosition.Preceding;
      } else {
        return DocumentPosition.Following;
      }
    };

    XMLNode.prototype.isSameNode = function(other) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.lookupPrefix = function(namespaceURI) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.isDefaultNamespace = function(namespaceURI) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.lookupNamespaceURI = function(prefix) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.isEqualNode = function(node) {
      var i, j, ref2;
      if (node.nodeType !== this.nodeType) {
        return false;
      }
      if (node.children.length !== this.children.length) {
        return false;
      }
      for (i = j = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
        if (!this.children[i].isEqualNode(node.children[i])) {
          return false;
        }
      }
      return true;
    };

    XMLNode.prototype.getFeature = function(feature, version) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.setUserData = function(key, data, handler) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.getUserData = function(key) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLNode.prototype.contains = function(other) {
      if (!other) {
        return false;
      }
      return other === this || this.isDescendant(other);
    };

    XMLNode.prototype.isDescendant = function(node) {
      var child, isDescendantChild, j, len, ref2;
      ref2 = this.children;
      for (j = 0, len = ref2.length; j < len; j++) {
        child = ref2[j];
        if (node === child) {
          return true;
        }
        isDescendantChild = child.isDescendant(node);
        if (isDescendantChild) {
          return true;
        }
      }
      return false;
    };

    XMLNode.prototype.isAncestor = function(node) {
      return node.isDescendant(this);
    };

    XMLNode.prototype.isPreceding = function(node) {
      var nodePos, thisPos;
      nodePos = this.treePosition(node);
      thisPos = this.treePosition(this);
      if (nodePos === -1 || thisPos === -1) {
        return false;
      } else {
        return nodePos < thisPos;
      }
    };

    XMLNode.prototype.isFollowing = function(node) {
      var nodePos, thisPos;
      nodePos = this.treePosition(node);
      thisPos = this.treePosition(this);
      if (nodePos === -1 || thisPos === -1) {
        return false;
      } else {
        return nodePos > thisPos;
      }
    };

    XMLNode.prototype.treePosition = function(node) {
      var found, pos;
      pos = 0;
      found = false;
      this.foreachTreeNode(this.document(), function(childNode) {
        pos++;
        if (!found && childNode === node) {
          return found = true;
        }
      });
      if (found) {
        return pos;
      } else {
        return -1;
      }
    };

    XMLNode.prototype.foreachTreeNode = function(node, func) {
      var child, j, len, ref2, res;
      node || (node = this.document());
      ref2 = node.children;
      for (j = 0, len = ref2.length; j < len; j++) {
        child = ref2[j];
        if (res = func(child)) {
          return res;
        } else {
          res = this.foreachTreeNode(child, func);
          if (res) {
            return res;
          }
        }
      }
    };

    return XMLNode;

  })();

}).call(this);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLAttribute, XMLElement, XMLNamedNodeMap, XMLNode, getValue, isFunction, isObject, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = __webpack_require__(23), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;

  XMLNode = __webpack_require__(29);

  NodeType = __webpack_require__(31);

  XMLAttribute = __webpack_require__(32);

  XMLNamedNodeMap = __webpack_require__(33);

  module.exports = XMLElement = (function(superClass) {
    extend(XMLElement, superClass);

    function XMLElement(parent, name, attributes) {
      var child, j, len, ref1;
      XMLElement.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing element name. " + this.debugInfo());
      }
      this.name = this.stringify.name(name);
      this.type = NodeType.Element;
      this.attribs = {};
      this.schemaTypeInfo = null;
      if (attributes != null) {
        this.attribute(attributes);
      }
      if (parent.type === NodeType.Document) {
        this.isRoot = true;
        this.documentObject = parent;
        parent.rootObject = this;
        if (parent.children) {
          ref1 = parent.children;
          for (j = 0, len = ref1.length; j < len; j++) {
            child = ref1[j];
            if (child.type === NodeType.DocType) {
              child.name = this.name;
              break;
            }
          }
        }
      }
    }

    Object.defineProperty(XMLElement.prototype, 'tagName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLElement.prototype, 'namespaceURI', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLElement.prototype, 'prefix', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLElement.prototype, 'localName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLElement.prototype, 'id', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLElement.prototype, 'className', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLElement.prototype, 'classList', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLElement.prototype, 'attributes', {
      get: function() {
        if (!this.attributeMap || !this.attributeMap.nodes) {
          this.attributeMap = new XMLNamedNodeMap(this.attribs);
        }
        return this.attributeMap;
      }
    });

    XMLElement.prototype.clone = function() {
      var att, attName, clonedSelf, ref1;
      clonedSelf = Object.create(this);
      if (clonedSelf.isRoot) {
        clonedSelf.documentObject = null;
      }
      clonedSelf.attribs = {};
      ref1 = this.attribs;
      for (attName in ref1) {
        if (!hasProp.call(ref1, attName)) continue;
        att = ref1[attName];
        clonedSelf.attribs[attName] = att.clone();
      }
      clonedSelf.children = [];
      this.children.forEach(function(child) {
        var clonedChild;
        clonedChild = child.clone();
        clonedChild.parent = clonedSelf;
        return clonedSelf.children.push(clonedChild);
      });
      return clonedSelf;
    };

    XMLElement.prototype.attribute = function(name, value) {
      var attName, attValue;
      if (name != null) {
        name = getValue(name);
      }
      if (isObject(name)) {
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (this.options.keepNullAttributes && (value == null)) {
          this.attribs[name] = new XMLAttribute(this, name, "");
        } else if (value != null) {
          this.attribs[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    };

    XMLElement.prototype.removeAttribute = function(name) {
      var attName, j, len;
      if (name == null) {
        throw new Error("Missing attribute name. " + this.debugInfo());
      }
      name = getValue(name);
      if (Array.isArray(name)) {
        for (j = 0, len = name.length; j < len; j++) {
          attName = name[j];
          delete this.attribs[attName];
        }
      } else {
        delete this.attribs[name];
      }
      return this;
    };

    XMLElement.prototype.toString = function(options) {
      return this.options.writer.element(this, this.options.writer.filterOptions(options));
    };

    XMLElement.prototype.att = function(name, value) {
      return this.attribute(name, value);
    };

    XMLElement.prototype.a = function(name, value) {
      return this.attribute(name, value);
    };

    XMLElement.prototype.getAttribute = function(name) {
      if (this.attribs.hasOwnProperty(name)) {
        return this.attribs[name].value;
      } else {
        return null;
      }
    };

    XMLElement.prototype.setAttribute = function(name, value) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getAttributeNode = function(name) {
      if (this.attribs.hasOwnProperty(name)) {
        return this.attribs[name];
      } else {
        return null;
      }
    };

    XMLElement.prototype.setAttributeNode = function(newAttr) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.removeAttributeNode = function(oldAttr) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByTagName = function(name) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getAttributeNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.removeAttributeNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.setAttributeNodeNS = function(newAttr) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.hasAttribute = function(name) {
      return this.attribs.hasOwnProperty(name);
    };

    XMLElement.prototype.hasAttributeNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.setIdAttribute = function(name, isId) {
      if (this.attribs.hasOwnProperty(name)) {
        return this.attribs[name].isId;
      } else {
        return isId;
      }
    };

    XMLElement.prototype.setIdAttributeNS = function(namespaceURI, localName, isId) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.setIdAttributeNode = function(idAttr, isId) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByTagName = function(tagname) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.getElementsByClassName = function(classNames) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLElement.prototype.isEqualNode = function(node) {
      var i, j, ref1;
      if (!XMLElement.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
        return false;
      }
      if (node.namespaceURI !== this.namespaceURI) {
        return false;
      }
      if (node.prefix !== this.prefix) {
        return false;
      }
      if (node.localName !== this.localName) {
        return false;
      }
      if (node.attribs.length !== this.attribs.length) {
        return false;
      }
      for (i = j = 0, ref1 = this.attribs.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
        if (!this.attribs[i].isEqualNode(node.attribs[i])) {
          return false;
        }
      }
      return true;
    };

    return XMLElement;

  })(XMLNode);

}).call(this);


/***/ }),
/* 31 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  module.exports = {
    Element: 1,
    Attribute: 2,
    Text: 3,
    CData: 4,
    EntityReference: 5,
    EntityDeclaration: 6,
    ProcessingInstruction: 7,
    Comment: 8,
    Document: 9,
    DocType: 10,
    DocumentFragment: 11,
    NotationDeclaration: 12,
    Declaration: 201,
    Raw: 202,
    AttributeDeclaration: 203,
    ElementDeclaration: 204,
    Dummy: 205
  };

}).call(this);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLAttribute, XMLNode;

  NodeType = __webpack_require__(31);

  XMLNode = __webpack_require__(29);

  module.exports = XMLAttribute = (function() {
    function XMLAttribute(parent, name, value) {
      this.parent = parent;
      if (this.parent) {
        this.options = this.parent.options;
        this.stringify = this.parent.stringify;
      }
      if (name == null) {
        throw new Error("Missing attribute name. " + this.debugInfo(name));
      }
      this.name = this.stringify.name(name);
      this.value = this.stringify.attValue(value);
      this.type = NodeType.Attribute;
      this.isId = false;
      this.schemaTypeInfo = null;
    }

    Object.defineProperty(XMLAttribute.prototype, 'nodeType', {
      get: function() {
        return this.type;
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'ownerElement', {
      get: function() {
        return this.parent;
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'textContent', {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.value = value || '';
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'namespaceURI', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'prefix', {
      get: function() {
        return '';
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'localName', {
      get: function() {
        return this.name;
      }
    });

    Object.defineProperty(XMLAttribute.prototype, 'specified', {
      get: function() {
        return true;
      }
    });

    XMLAttribute.prototype.clone = function() {
      return Object.create(this);
    };

    XMLAttribute.prototype.toString = function(options) {
      return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
    };

    XMLAttribute.prototype.debugInfo = function(name) {
      name = name || this.name;
      if (name == null) {
        return "parent: <" + this.parent.name + ">";
      } else {
        return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
      }
    };

    XMLAttribute.prototype.isEqualNode = function(node) {
      if (node.namespaceURI !== this.namespaceURI) {
        return false;
      }
      if (node.prefix !== this.prefix) {
        return false;
      }
      if (node.localName !== this.localName) {
        return false;
      }
      if (node.value !== this.value) {
        return false;
      }
      return true;
    };

    return XMLAttribute;

  })();

}).call(this);


/***/ }),
/* 33 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNamedNodeMap;

  module.exports = XMLNamedNodeMap = (function() {
    function XMLNamedNodeMap(nodes) {
      this.nodes = nodes;
    }

    Object.defineProperty(XMLNamedNodeMap.prototype, 'length', {
      get: function() {
        return Object.keys(this.nodes).length || 0;
      }
    });

    XMLNamedNodeMap.prototype.clone = function() {
      return this.nodes = null;
    };

    XMLNamedNodeMap.prototype.getNamedItem = function(name) {
      return this.nodes[name];
    };

    XMLNamedNodeMap.prototype.setNamedItem = function(node) {
      var oldNode;
      oldNode = this.nodes[node.nodeName];
      this.nodes[node.nodeName] = node;
      return oldNode || null;
    };

    XMLNamedNodeMap.prototype.removeNamedItem = function(name) {
      var oldNode;
      oldNode = this.nodes[name];
      delete this.nodes[name];
      return oldNode || null;
    };

    XMLNamedNodeMap.prototype.item = function(index) {
      return this.nodes[Object.keys(this.nodes)[index]] || null;
    };

    XMLNamedNodeMap.prototype.getNamedItemNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLNamedNodeMap.prototype.setNamedItemNS = function(node) {
      throw new Error("This DOM method is not implemented.");
    };

    XMLNamedNodeMap.prototype.removeNamedItemNS = function(namespaceURI, localName) {
      throw new Error("This DOM method is not implemented.");
    };

    return XMLNamedNodeMap;

  })();

}).call(this);


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLCData, XMLCharacterData,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __webpack_require__(31);

  XMLCharacterData = __webpack_require__(35);

  module.exports = XMLCData = (function(superClass) {
    extend(XMLCData, superClass);

    function XMLCData(parent, text) {
      XMLCData.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing CDATA text. " + this.debugInfo());
      }
      this.name = "#cdata-section";
      this.type = NodeType.CData;
      this.value = this.stringify.cdata(text);
    }

    XMLCData.prototype.clone = function() {
      return Object.create(this);
    };

    XMLCData.prototype.toString = function(options) {
      return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
    };

    return XMLCData;

  })(XMLCharacterData);

}).call(this);


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLCharacterData, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(29);

  module.exports = XMLCharacterData = (function(superClass) {
    extend(XMLCharacterData, superClass);

    function XMLCharacterData(parent) {
      XMLCharacterData.__super__.constructor.call(this, parent);
      this.value = '';
    }

    Object.defineProperty(XMLCharacterData.prototype, 'data', {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.value = value || '';
      }
    });

    Object.defineProperty(XMLCharacterData.prototype, 'length', {
      get: function() {
        return this.value.length;
      }
    });

    Object.defineProperty(XMLCharacterData.prototype, 'textContent', {
      get: function() {
        return this.value;
      },
      set: function(value) {
        return this.value = value || '';
      }
    });

    XMLCharacterData.prototype.clone = function() {
      return Object.create(this);
    };

    XMLCharacterData.prototype.substringData = function(offset, count) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.appendData = function(arg) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.insertData = function(offset, arg) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.deleteData = function(offset, count) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.replaceData = function(offset, count, arg) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLCharacterData.prototype.isEqualNode = function(node) {
      if (!XMLCharacterData.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
        return false;
      }
      if (node.data !== this.data) {
        return false;
      }
      return true;
    };

    return XMLCharacterData;

  })(XMLNode);

}).call(this);


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLCharacterData, XMLComment,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __webpack_require__(31);

  XMLCharacterData = __webpack_require__(35);

  module.exports = XMLComment = (function(superClass) {
    extend(XMLComment, superClass);

    function XMLComment(parent, text) {
      XMLComment.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing comment text. " + this.debugInfo());
      }
      this.name = "#comment";
      this.type = NodeType.Comment;
      this.value = this.stringify.comment(text);
    }

    XMLComment.prototype.clone = function() {
      return Object.create(this);
    };

    XMLComment.prototype.toString = function(options) {
      return this.options.writer.comment(this, this.options.writer.filterOptions(options));
    };

    return XMLComment;

  })(XMLCharacterData);

}).call(this);


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDeclaration, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = __webpack_require__(23).isObject;

  XMLNode = __webpack_require__(29);

  NodeType = __webpack_require__(31);

  module.exports = XMLDeclaration = (function(superClass) {
    extend(XMLDeclaration, superClass);

    function XMLDeclaration(parent, version, encoding, standalone) {
      var ref;
      XMLDeclaration.__super__.constructor.call(this, parent);
      if (isObject(version)) {
        ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
      }
      if (!version) {
        version = '1.0';
      }
      this.type = NodeType.Declaration;
      this.version = this.stringify.xmlVersion(version);
      if (encoding != null) {
        this.encoding = this.stringify.xmlEncoding(encoding);
      }
      if (standalone != null) {
        this.standalone = this.stringify.xmlStandalone(standalone);
      }
    }

    XMLDeclaration.prototype.toString = function(options) {
      return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
    };

    return XMLDeclaration;

  })(XMLNode);

}).call(this);


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNamedNodeMap, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = __webpack_require__(23).isObject;

  XMLNode = __webpack_require__(29);

  NodeType = __webpack_require__(31);

  XMLDTDAttList = __webpack_require__(39);

  XMLDTDEntity = __webpack_require__(40);

  XMLDTDElement = __webpack_require__(41);

  XMLDTDNotation = __webpack_require__(42);

  XMLNamedNodeMap = __webpack_require__(33);

  module.exports = XMLDocType = (function(superClass) {
    extend(XMLDocType, superClass);

    function XMLDocType(parent, pubID, sysID) {
      var child, i, len, ref, ref1, ref2;
      XMLDocType.__super__.constructor.call(this, parent);
      this.type = NodeType.DocType;
      if (parent.children) {
        ref = parent.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (child.type === NodeType.Element) {
            this.name = child.name;
            break;
          }
        }
      }
      this.documentObject = parent;
      if (isObject(pubID)) {
        ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
      }
      if (sysID == null) {
        ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
      }
      if (pubID != null) {
        this.pubID = this.stringify.dtdPubID(pubID);
      }
      if (sysID != null) {
        this.sysID = this.stringify.dtdSysID(sysID);
      }
    }

    Object.defineProperty(XMLDocType.prototype, 'entities', {
      get: function() {
        var child, i, len, nodes, ref;
        nodes = {};
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if ((child.type === NodeType.EntityDeclaration) && !child.pe) {
            nodes[child.name] = child;
          }
        }
        return new XMLNamedNodeMap(nodes);
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'notations', {
      get: function() {
        var child, i, len, nodes, ref;
        nodes = {};
        ref = this.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (child.type === NodeType.NotationDeclaration) {
            nodes[child.name] = child;
          }
        }
        return new XMLNamedNodeMap(nodes);
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'publicId', {
      get: function() {
        return this.pubID;
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'systemId', {
      get: function() {
        return this.sysID;
      }
    });

    Object.defineProperty(XMLDocType.prototype, 'internalSubset', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    XMLDocType.prototype.element = function(name, value) {
      var child;
      child = new XMLDTDElement(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var child;
      child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.entity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, false, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.pEntity = function(name, value) {
      var child;
      child = new XMLDTDEntity(this, true, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.notation = function(name, value) {
      var child;
      child = new XMLDTDNotation(this, name, value);
      this.children.push(child);
      return this;
    };

    XMLDocType.prototype.toString = function(options) {
      return this.options.writer.docType(this, this.options.writer.filterOptions(options));
    };

    XMLDocType.prototype.ele = function(name, value) {
      return this.element(name, value);
    };

    XMLDocType.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
    };

    XMLDocType.prototype.ent = function(name, value) {
      return this.entity(name, value);
    };

    XMLDocType.prototype.pent = function(name, value) {
      return this.pEntity(name, value);
    };

    XMLDocType.prototype.not = function(name, value) {
      return this.notation(name, value);
    };

    XMLDocType.prototype.up = function() {
      return this.root() || this.documentObject;
    };

    XMLDocType.prototype.isEqualNode = function(node) {
      if (!XMLDocType.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
        return false;
      }
      if (node.name !== this.name) {
        return false;
      }
      if (node.publicId !== this.publicId) {
        return false;
      }
      if (node.systemId !== this.systemId) {
        return false;
      }
      return true;
    };

    return XMLDocType;

  })(XMLNode);

}).call(this);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDAttList, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(29);

  NodeType = __webpack_require__(31);

  module.exports = XMLDTDAttList = (function(superClass) {
    extend(XMLDTDAttList, superClass);

    function XMLDTDAttList(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      XMLDTDAttList.__super__.constructor.call(this, parent);
      if (elementName == null) {
        throw new Error("Missing DTD element name. " + this.debugInfo());
      }
      if (attributeName == null) {
        throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
      }
      if (!attributeType) {
        throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
      }
      if (!defaultValueType) {
        throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
      }
      if (defaultValueType.indexOf('#') !== 0) {
        defaultValueType = '#' + defaultValueType;
      }
      if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
        throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
      }
      if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
        throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
      }
      this.elementName = this.stringify.name(elementName);
      this.type = NodeType.AttributeDeclaration;
      this.attributeName = this.stringify.name(attributeName);
      this.attributeType = this.stringify.dtdAttType(attributeType);
      if (defaultValue) {
        this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
      }
      this.defaultValueType = defaultValueType;
    }

    XMLDTDAttList.prototype.toString = function(options) {
      return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
    };

    return XMLDTDAttList;

  })(XMLNode);

}).call(this);


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDEntity, XMLNode, isObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  isObject = __webpack_require__(23).isObject;

  XMLNode = __webpack_require__(29);

  NodeType = __webpack_require__(31);

  module.exports = XMLDTDEntity = (function(superClass) {
    extend(XMLDTDEntity, superClass);

    function XMLDTDEntity(parent, pe, name, value) {
      XMLDTDEntity.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing DTD entity name. " + this.debugInfo(name));
      }
      if (value == null) {
        throw new Error("Missing DTD entity value. " + this.debugInfo(name));
      }
      this.pe = !!pe;
      this.name = this.stringify.name(name);
      this.type = NodeType.EntityDeclaration;
      if (!isObject(value)) {
        this.value = this.stringify.dtdEntityValue(value);
        this.internal = true;
      } else {
        if (!value.pubID && !value.sysID) {
          throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
        }
        if (value.pubID && !value.sysID) {
          throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
        }
        this.internal = false;
        if (value.pubID != null) {
          this.pubID = this.stringify.dtdPubID(value.pubID);
        }
        if (value.sysID != null) {
          this.sysID = this.stringify.dtdSysID(value.sysID);
        }
        if (value.nData != null) {
          this.nData = this.stringify.dtdNData(value.nData);
        }
        if (this.pe && this.nData) {
          throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
        }
      }
    }

    Object.defineProperty(XMLDTDEntity.prototype, 'publicId', {
      get: function() {
        return this.pubID;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'systemId', {
      get: function() {
        return this.sysID;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'notationName', {
      get: function() {
        return this.nData || null;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'inputEncoding', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'xmlEncoding', {
      get: function() {
        return null;
      }
    });

    Object.defineProperty(XMLDTDEntity.prototype, 'xmlVersion', {
      get: function() {
        return null;
      }
    });

    XMLDTDEntity.prototype.toString = function(options) {
      return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
    };

    return XMLDTDEntity;

  })(XMLNode);

}).call(this);


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDElement, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(29);

  NodeType = __webpack_require__(31);

  module.exports = XMLDTDElement = (function(superClass) {
    extend(XMLDTDElement, superClass);

    function XMLDTDElement(parent, name, value) {
      XMLDTDElement.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing DTD element name. " + this.debugInfo());
      }
      if (!value) {
        value = '(#PCDATA)';
      }
      if (Array.isArray(value)) {
        value = '(' + value.join(',') + ')';
      }
      this.name = this.stringify.name(name);
      this.type = NodeType.ElementDeclaration;
      this.value = this.stringify.dtdElementValue(value);
    }

    XMLDTDElement.prototype.toString = function(options) {
      return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
    };

    return XMLDTDElement;

  })(XMLNode);

}).call(this);


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDTDNotation, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(29);

  NodeType = __webpack_require__(31);

  module.exports = XMLDTDNotation = (function(superClass) {
    extend(XMLDTDNotation, superClass);

    function XMLDTDNotation(parent, name, value) {
      XMLDTDNotation.__super__.constructor.call(this, parent);
      if (name == null) {
        throw new Error("Missing DTD notation name. " + this.debugInfo(name));
      }
      if (!value.pubID && !value.sysID) {
        throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
      }
      this.name = this.stringify.name(name);
      this.type = NodeType.NotationDeclaration;
      if (value.pubID != null) {
        this.pubID = this.stringify.dtdPubID(value.pubID);
      }
      if (value.sysID != null) {
        this.sysID = this.stringify.dtdSysID(value.sysID);
      }
    }

    Object.defineProperty(XMLDTDNotation.prototype, 'publicId', {
      get: function() {
        return this.pubID;
      }
    });

    Object.defineProperty(XMLDTDNotation.prototype, 'systemId', {
      get: function() {
        return this.sysID;
      }
    });

    XMLDTDNotation.prototype.toString = function(options) {
      return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
    };

    return XMLDTDNotation;

  })(XMLNode);

}).call(this);


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLNode, XMLRaw,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __webpack_require__(31);

  XMLNode = __webpack_require__(29);

  module.exports = XMLRaw = (function(superClass) {
    extend(XMLRaw, superClass);

    function XMLRaw(parent, text) {
      XMLRaw.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing raw text. " + this.debugInfo());
      }
      this.type = NodeType.Raw;
      this.value = this.stringify.raw(text);
    }

    XMLRaw.prototype.clone = function() {
      return Object.create(this);
    };

    XMLRaw.prototype.toString = function(options) {
      return this.options.writer.raw(this, this.options.writer.filterOptions(options));
    };

    return XMLRaw;

  })(XMLNode);

}).call(this);


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLCharacterData, XMLText,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __webpack_require__(31);

  XMLCharacterData = __webpack_require__(35);

  module.exports = XMLText = (function(superClass) {
    extend(XMLText, superClass);

    function XMLText(parent, text) {
      XMLText.__super__.constructor.call(this, parent);
      if (text == null) {
        throw new Error("Missing element text. " + this.debugInfo());
      }
      this.name = "#text";
      this.type = NodeType.Text;
      this.value = this.stringify.text(text);
    }

    Object.defineProperty(XMLText.prototype, 'isElementContentWhitespace', {
      get: function() {
        throw new Error("This DOM method is not implemented." + this.debugInfo());
      }
    });

    Object.defineProperty(XMLText.prototype, 'wholeText', {
      get: function() {
        var next, prev, str;
        str = '';
        prev = this.previousSibling;
        while (prev) {
          str = prev.data + str;
          prev = prev.previousSibling;
        }
        str += this.data;
        next = this.nextSibling;
        while (next) {
          str = str + next.data;
          next = next.nextSibling;
        }
        return str;
      }
    });

    XMLText.prototype.clone = function() {
      return Object.create(this);
    };

    XMLText.prototype.toString = function(options) {
      return this.options.writer.text(this, this.options.writer.filterOptions(options));
    };

    XMLText.prototype.splitText = function(offset) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    XMLText.prototype.replaceWholeText = function(content) {
      throw new Error("This DOM method is not implemented." + this.debugInfo());
    };

    return XMLText;

  })(XMLCharacterData);

}).call(this);


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLCharacterData, XMLProcessingInstruction,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __webpack_require__(31);

  XMLCharacterData = __webpack_require__(35);

  module.exports = XMLProcessingInstruction = (function(superClass) {
    extend(XMLProcessingInstruction, superClass);

    function XMLProcessingInstruction(parent, target, value) {
      XMLProcessingInstruction.__super__.constructor.call(this, parent);
      if (target == null) {
        throw new Error("Missing instruction target. " + this.debugInfo());
      }
      this.type = NodeType.ProcessingInstruction;
      this.target = this.stringify.insTarget(target);
      this.name = this.target;
      if (value) {
        this.value = this.stringify.insValue(value);
      }
    }

    XMLProcessingInstruction.prototype.clone = function() {
      return Object.create(this);
    };

    XMLProcessingInstruction.prototype.toString = function(options) {
      return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
    };

    XMLProcessingInstruction.prototype.isEqualNode = function(node) {
      if (!XMLProcessingInstruction.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
        return false;
      }
      if (node.target !== this.target) {
        return false;
      }
      return true;
    };

    return XMLProcessingInstruction;

  })(XMLCharacterData);

}).call(this);


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, XMLDummy, XMLNode,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLNode = __webpack_require__(29);

  NodeType = __webpack_require__(31);

  module.exports = XMLDummy = (function(superClass) {
    extend(XMLDummy, superClass);

    function XMLDummy(parent) {
      XMLDummy.__super__.constructor.call(this, parent);
      this.type = NodeType.Dummy;
    }

    XMLDummy.prototype.clone = function() {
      return Object.create(this);
    };

    XMLDummy.prototype.toString = function(options) {
      return '';
    };

    return XMLDummy;

  })(XMLNode);

}).call(this);


/***/ }),
/* 47 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLNodeList;

  module.exports = XMLNodeList = (function() {
    function XMLNodeList(nodes) {
      this.nodes = nodes;
    }

    Object.defineProperty(XMLNodeList.prototype, 'length', {
      get: function() {
        return this.nodes.length || 0;
      }
    });

    XMLNodeList.prototype.clone = function() {
      return this.nodes = null;
    };

    XMLNodeList.prototype.item = function(index) {
      return this.nodes[index] || null;
    };

    return XMLNodeList;

  })();

}).call(this);


/***/ }),
/* 48 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  module.exports = {
    Disconnected: 1,
    Preceding: 2,
    Following: 4,
    Contains: 8,
    ContainedBy: 16,
    ImplementationSpecific: 32
  };

}).call(this);


/***/ }),
/* 49 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLStringifier,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    hasProp = {}.hasOwnProperty;

  module.exports = XMLStringifier = (function() {
    function XMLStringifier(options) {
      this.assertLegalName = bind(this.assertLegalName, this);
      this.assertLegalChar = bind(this.assertLegalChar, this);
      var key, ref, value;
      options || (options = {});
      this.options = options;
      if (!this.options.version) {
        this.options.version = '1.0';
      }
      ref = options.stringify || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this[key] = value;
      }
    }

    XMLStringifier.prototype.name = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalName('' + val || '');
    };

    XMLStringifier.prototype.text = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar(this.textEscape('' + val || ''));
    };

    XMLStringifier.prototype.cdata = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      val = val.replace(']]>', ']]]]><![CDATA[>');
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.comment = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      if (val.match(/--/)) {
        throw new Error("Comment text cannot contain double-hypen: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.raw = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return '' + val || '';
    };

    XMLStringifier.prototype.attValue = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar(this.attEscape(val = '' + val || ''));
    };

    XMLStringifier.prototype.insTarget = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.insValue = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      if (val.match(/\?>/)) {
        throw new Error("Invalid processing instruction value: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.xmlVersion = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      if (!val.match(/1\.[0-9]+/)) {
        throw new Error("Invalid version number: " + val);
      }
      return val;
    };

    XMLStringifier.prototype.xmlEncoding = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      val = '' + val || '';
      if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
        throw new Error("Invalid encoding: " + val);
      }
      return this.assertLegalChar(val);
    };

    XMLStringifier.prototype.xmlStandalone = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      if (val) {
        return "yes";
      } else {
        return "no";
      }
    };

    XMLStringifier.prototype.dtdPubID = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdSysID = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdElementValue = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdAttType = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdAttDefault = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdEntityValue = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.dtdNData = function(val) {
      if (this.options.noValidation) {
        return val;
      }
      return this.assertLegalChar('' + val || '');
    };

    XMLStringifier.prototype.convertAttKey = '@';

    XMLStringifier.prototype.convertPIKey = '?';

    XMLStringifier.prototype.convertTextKey = '#text';

    XMLStringifier.prototype.convertCDataKey = '#cdata';

    XMLStringifier.prototype.convertCommentKey = '#comment';

    XMLStringifier.prototype.convertRawKey = '#raw';

    XMLStringifier.prototype.assertLegalChar = function(str) {
      var regex, res;
      if (this.options.noValidation) {
        return str;
      }
      regex = '';
      if (this.options.version === '1.0') {
        regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
        if (res = str.match(regex)) {
          throw new Error("Invalid character in string: " + str + " at index " + res.index);
        }
      } else if (this.options.version === '1.1') {
        regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
        if (res = str.match(regex)) {
          throw new Error("Invalid character in string: " + str + " at index " + res.index);
        }
      }
      return str;
    };

    XMLStringifier.prototype.assertLegalName = function(str) {
      var regex;
      if (this.options.noValidation) {
        return str;
      }
      this.assertLegalChar(str);
      regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
      if (!str.match(regex)) {
        throw new Error("Invalid character in name");
      }
      return str;
    };

    XMLStringifier.prototype.textEscape = function(str) {
      var ampregex;
      if (this.options.noValidation) {
        return str;
      }
      ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
      return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r/g, '&#xD;');
    };

    XMLStringifier.prototype.attEscape = function(str) {
      var ampregex;
      if (this.options.noValidation) {
        return str;
      }
      ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
      return str.replace(ampregex, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/\t/g, '&#x9;').replace(/\n/g, '&#xA;').replace(/\r/g, '&#xD;');
    };

    return XMLStringifier;

  })();

}).call(this);


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var XMLStringWriter, XMLWriterBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  XMLWriterBase = __webpack_require__(51);

  module.exports = XMLStringWriter = (function(superClass) {
    extend(XMLStringWriter, superClass);

    function XMLStringWriter(options) {
      XMLStringWriter.__super__.constructor.call(this, options);
    }

    XMLStringWriter.prototype.document = function(doc, options) {
      var child, i, len, r, ref;
      options = this.filterOptions(options);
      r = '';
      ref = doc.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        r += this.writeChildNode(child, options, 0);
      }
      if (options.pretty && r.slice(-options.newline.length) === options.newline) {
        r = r.slice(0, -options.newline.length);
      }
      return r;
    };

    return XMLStringWriter;

  })(XMLWriterBase);

}).call(this);


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, WriterState, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, assign,
    hasProp = {}.hasOwnProperty;

  assign = __webpack_require__(23).assign;

  NodeType = __webpack_require__(31);

  XMLDeclaration = __webpack_require__(37);

  XMLDocType = __webpack_require__(38);

  XMLCData = __webpack_require__(34);

  XMLComment = __webpack_require__(36);

  XMLElement = __webpack_require__(30);

  XMLRaw = __webpack_require__(43);

  XMLText = __webpack_require__(44);

  XMLProcessingInstruction = __webpack_require__(45);

  XMLDummy = __webpack_require__(46);

  XMLDTDAttList = __webpack_require__(39);

  XMLDTDElement = __webpack_require__(41);

  XMLDTDEntity = __webpack_require__(40);

  XMLDTDNotation = __webpack_require__(42);

  WriterState = __webpack_require__(52);

  module.exports = XMLWriterBase = (function() {
    function XMLWriterBase(options) {
      var key, ref, value;
      options || (options = {});
      this.options = options;
      ref = options.writer || {};
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        value = ref[key];
        this["_" + key] = this[key];
        this[key] = value;
      }
    }

    XMLWriterBase.prototype.filterOptions = function(options) {
      var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
      options || (options = {});
      options = assign({}, this.options, options);
      filteredOptions = {
        writer: this
      };
      filteredOptions.pretty = options.pretty || false;
      filteredOptions.allowEmpty = options.allowEmpty || false;
      filteredOptions.indent = (ref = options.indent) != null ? ref : '  ';
      filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : '\n';
      filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
      filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options.dontPrettyTextNodes) != null ? ref4 : options.dontprettytextnodes) != null ? ref3 : 0;
      filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options.spaceBeforeSlash) != null ? ref6 : options.spacebeforeslash) != null ? ref5 : '';
      if (filteredOptions.spaceBeforeSlash === true) {
        filteredOptions.spaceBeforeSlash = ' ';
      }
      filteredOptions.suppressPrettyCount = 0;
      filteredOptions.user = {};
      filteredOptions.state = WriterState.None;
      return filteredOptions;
    };

    XMLWriterBase.prototype.indent = function(node, options, level) {
      var indentLevel;
      if (!options.pretty || options.suppressPrettyCount) {
        return '';
      } else if (options.pretty) {
        indentLevel = (level || 0) + options.offset + 1;
        if (indentLevel > 0) {
          return new Array(indentLevel).join(options.indent);
        }
      }
      return '';
    };

    XMLWriterBase.prototype.endline = function(node, options, level) {
      if (!options.pretty || options.suppressPrettyCount) {
        return '';
      } else {
        return options.newline;
      }
    };

    XMLWriterBase.prototype.attribute = function(att, options, level) {
      var r;
      this.openAttribute(att, options, level);
      r = ' ' + att.name + '="' + att.value + '"';
      this.closeAttribute(att, options, level);
      return r;
    };

    XMLWriterBase.prototype.cdata = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<![CDATA[';
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += ']]>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.comment = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!-- ';
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += ' -->' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.declaration = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<?xml';
      options.state = WriterState.InsideTag;
      r += ' version="' + node.version + '"';
      if (node.encoding != null) {
        r += ' encoding="' + node.encoding + '"';
      }
      if (node.standalone != null) {
        r += ' standalone="' + node.standalone + '"';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '?>';
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.docType = function(node, options, level) {
      var child, i, len, r, ref;
      level || (level = 0);
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level);
      r += '<!DOCTYPE ' + node.root().name;
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      if (node.children.length > 0) {
        r += ' [';
        r += this.endline(node, options, level);
        options.state = WriterState.InsideTag;
        ref = node.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          r += this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        r += ']';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>';
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.element = function(node, options, level) {
      var att, child, childNodeCount, firstChildNode, i, j, len, len1, name, prettySuppressed, r, ref, ref1, ref2;
      level || (level = 0);
      prettySuppressed = false;
      r = '';
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r += this.indent(node, options, level) + '<' + node.name;
      ref = node.attribs;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        att = ref[name];
        r += this.attribute(att, options, level);
      }
      childNodeCount = node.children.length;
      firstChildNode = childNodeCount === 0 ? null : node.children[0];
      if (childNodeCount === 0 || node.children.every(function(e) {
        return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === '';
      })) {
        if (options.allowEmpty) {
          r += '>';
          options.state = WriterState.CloseTag;
          r += '</' + node.name + '>' + this.endline(node, options, level);
        } else {
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + '/>' + this.endline(node, options, level);
        }
      } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && (firstChildNode.value != null)) {
        r += '>';
        options.state = WriterState.InsideTag;
        options.suppressPrettyCount++;
        prettySuppressed = true;
        r += this.writeChildNode(firstChildNode, options, level + 1);
        options.suppressPrettyCount--;
        prettySuppressed = false;
        options.state = WriterState.CloseTag;
        r += '</' + node.name + '>' + this.endline(node, options, level);
      } else {
        if (options.dontPrettyTextNodes) {
          ref1 = node.children;
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            if ((child.type === NodeType.Text || child.type === NodeType.Raw) && (child.value != null)) {
              options.suppressPrettyCount++;
              prettySuppressed = true;
              break;
            }
          }
        }
        r += '>' + this.endline(node, options, level);
        options.state = WriterState.InsideTag;
        ref2 = node.children;
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          child = ref2[j];
          r += this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        r += this.indent(node, options, level) + '</' + node.name + '>';
        if (prettySuppressed) {
          options.suppressPrettyCount--;
        }
        r += this.endline(node, options, level);
        options.state = WriterState.None;
      }
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.writeChildNode = function(node, options, level) {
      switch (node.type) {
        case NodeType.CData:
          return this.cdata(node, options, level);
        case NodeType.Comment:
          return this.comment(node, options, level);
        case NodeType.Element:
          return this.element(node, options, level);
        case NodeType.Raw:
          return this.raw(node, options, level);
        case NodeType.Text:
          return this.text(node, options, level);
        case NodeType.ProcessingInstruction:
          return this.processingInstruction(node, options, level);
        case NodeType.Dummy:
          return '';
        case NodeType.Declaration:
          return this.declaration(node, options, level);
        case NodeType.DocType:
          return this.docType(node, options, level);
        case NodeType.AttributeDeclaration:
          return this.dtdAttList(node, options, level);
        case NodeType.ElementDeclaration:
          return this.dtdElement(node, options, level);
        case NodeType.EntityDeclaration:
          return this.dtdEntity(node, options, level);
        case NodeType.NotationDeclaration:
          return this.dtdNotation(node, options, level);
        default:
          throw new Error("Unknown XML node type: " + node.constructor.name);
      }
    };

    XMLWriterBase.prototype.processingInstruction = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<?';
      options.state = WriterState.InsideTag;
      r += node.target;
      if (node.value) {
        r += ' ' + node.value;
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '?>';
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.raw = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level);
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.text = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level);
      options.state = WriterState.InsideTag;
      r += node.value;
      options.state = WriterState.CloseTag;
      r += this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.dtdAttList = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!ATTLIST';
      options.state = WriterState.InsideTag;
      r += ' ' + node.elementName + ' ' + node.attributeName + ' ' + node.attributeType;
      if (node.defaultValueType !== '#DEFAULT') {
        r += ' ' + node.defaultValueType;
      }
      if (node.defaultValue) {
        r += ' "' + node.defaultValue + '"';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.dtdElement = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!ELEMENT';
      options.state = WriterState.InsideTag;
      r += ' ' + node.name + ' ' + node.value;
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.dtdEntity = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!ENTITY';
      options.state = WriterState.InsideTag;
      if (node.pe) {
        r += ' %';
      }
      r += ' ' + node.name;
      if (node.value) {
        r += ' "' + node.value + '"';
      } else {
        if (node.pubID && node.sysID) {
          r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
        } else if (node.sysID) {
          r += ' SYSTEM "' + node.sysID + '"';
        }
        if (node.nData) {
          r += ' NDATA ' + node.nData;
        }
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.dtdNotation = function(node, options, level) {
      var r;
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      r = this.indent(node, options, level) + '<!NOTATION';
      options.state = WriterState.InsideTag;
      r += ' ' + node.name;
      if (node.pubID && node.sysID) {
        r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
      } else if (node.pubID) {
        r += ' PUBLIC "' + node.pubID + '"';
      } else if (node.sysID) {
        r += ' SYSTEM "' + node.sysID + '"';
      }
      options.state = WriterState.CloseTag;
      r += options.spaceBeforeSlash + '>' + this.endline(node, options, level);
      options.state = WriterState.None;
      this.closeNode(node, options, level);
      return r;
    };

    XMLWriterBase.prototype.openNode = function(node, options, level) {};

    XMLWriterBase.prototype.closeNode = function(node, options, level) {};

    XMLWriterBase.prototype.openAttribute = function(att, options, level) {};

    XMLWriterBase.prototype.closeAttribute = function(att, options, level) {};

    return XMLWriterBase;

  })();

}).call(this);


/***/ }),
/* 52 */
/***/ (function(module, exports) {

// Generated by CoffeeScript 1.12.7
(function() {
  module.exports = {
    None: 0,
    OpenTag: 1,
    InsideTag: 2,
    CloseTag: 3
  };

}).call(this);


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, WriterState, XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocument, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref,
    hasProp = {}.hasOwnProperty;

  ref = __webpack_require__(23), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;

  NodeType = __webpack_require__(31);

  XMLDocument = __webpack_require__(25);

  XMLElement = __webpack_require__(30);

  XMLCData = __webpack_require__(34);

  XMLComment = __webpack_require__(36);

  XMLRaw = __webpack_require__(43);

  XMLText = __webpack_require__(44);

  XMLProcessingInstruction = __webpack_require__(45);

  XMLDeclaration = __webpack_require__(37);

  XMLDocType = __webpack_require__(38);

  XMLDTDAttList = __webpack_require__(39);

  XMLDTDEntity = __webpack_require__(40);

  XMLDTDElement = __webpack_require__(41);

  XMLDTDNotation = __webpack_require__(42);

  XMLAttribute = __webpack_require__(32);

  XMLStringifier = __webpack_require__(49);

  XMLStringWriter = __webpack_require__(50);

  WriterState = __webpack_require__(52);

  module.exports = XMLDocumentCB = (function() {
    function XMLDocumentCB(options, onData, onEnd) {
      var writerOptions;
      this.name = "?xml";
      this.type = NodeType.Document;
      options || (options = {});
      writerOptions = {};
      if (!options.writer) {
        options.writer = new XMLStringWriter();
      } else if (isPlainObject(options.writer)) {
        writerOptions = options.writer;
        options.writer = new XMLStringWriter();
      }
      this.options = options;
      this.writer = options.writer;
      this.writerOptions = this.writer.filterOptions(writerOptions);
      this.stringify = new XMLStringifier(options);
      this.onDataCallback = onData || function() {};
      this.onEndCallback = onEnd || function() {};
      this.currentNode = null;
      this.currentLevel = -1;
      this.openTags = {};
      this.documentStarted = false;
      this.documentCompleted = false;
      this.root = null;
    }

    XMLDocumentCB.prototype.createChildNode = function(node) {
      var att, attName, attributes, child, i, len, ref1, ref2;
      switch (node.type) {
        case NodeType.CData:
          this.cdata(node.value);
          break;
        case NodeType.Comment:
          this.comment(node.value);
          break;
        case NodeType.Element:
          attributes = {};
          ref1 = node.attribs;
          for (attName in ref1) {
            if (!hasProp.call(ref1, attName)) continue;
            att = ref1[attName];
            attributes[attName] = att.value;
          }
          this.node(node.name, attributes);
          break;
        case NodeType.Dummy:
          this.dummy();
          break;
        case NodeType.Raw:
          this.raw(node.value);
          break;
        case NodeType.Text:
          this.text(node.value);
          break;
        case NodeType.ProcessingInstruction:
          this.instruction(node.target, node.value);
          break;
        default:
          throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
      }
      ref2 = node.children;
      for (i = 0, len = ref2.length; i < len; i++) {
        child = ref2[i];
        this.createChildNode(child);
        if (child.type === NodeType.Element) {
          this.up();
        }
      }
      return this;
    };

    XMLDocumentCB.prototype.dummy = function() {
      return this;
    };

    XMLDocumentCB.prototype.node = function(name, attributes, text) {
      var ref1;
      if (name == null) {
        throw new Error("Missing node name.");
      }
      if (this.root && this.currentLevel === -1) {
        throw new Error("Document can only have one root node. " + this.debugInfo(name));
      }
      this.openCurrent();
      name = getValue(name);
      if (attributes == null) {
        attributes = {};
      }
      attributes = getValue(attributes);
      if (!isObject(attributes)) {
        ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
      }
      this.currentNode = new XMLElement(this, name, attributes);
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      if (text != null) {
        this.text(text);
      }
      return this;
    };

    XMLDocumentCB.prototype.element = function(name, attributes, text) {
      var child, i, len, oldValidationFlag, ref1, root;
      if (this.currentNode && this.currentNode.type === NodeType.DocType) {
        this.dtdElement.apply(this, arguments);
      } else {
        if (Array.isArray(name) || isObject(name) || isFunction(name)) {
          oldValidationFlag = this.options.noValidation;
          this.options.noValidation = true;
          root = new XMLDocument(this.options).element('TEMP_ROOT');
          root.element(name);
          this.options.noValidation = oldValidationFlag;
          ref1 = root.children;
          for (i = 0, len = ref1.length; i < len; i++) {
            child = ref1[i];
            this.createChildNode(child);
            if (child.type === NodeType.Element) {
              this.up();
            }
          }
        } else {
          this.node(name, attributes, text);
        }
      }
      return this;
    };

    XMLDocumentCB.prototype.attribute = function(name, value) {
      var attName, attValue;
      if (!this.currentNode || this.currentNode.children) {
        throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
      }
      if (name != null) {
        name = getValue(name);
      }
      if (isObject(name)) {
        for (attName in name) {
          if (!hasProp.call(name, attName)) continue;
          attValue = name[attName];
          this.attribute(attName, attValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        if (this.options.keepNullAttributes && (value == null)) {
          this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
        } else if (value != null) {
          this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
        }
      }
      return this;
    };

    XMLDocumentCB.prototype.text = function(value) {
      var node;
      this.openCurrent();
      node = new XMLText(this, value);
      this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.cdata = function(value) {
      var node;
      this.openCurrent();
      node = new XMLCData(this, value);
      this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.comment = function(value) {
      var node;
      this.openCurrent();
      node = new XMLComment(this, value);
      this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.raw = function(value) {
      var node;
      this.openCurrent();
      node = new XMLRaw(this, value);
      this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.instruction = function(target, value) {
      var i, insTarget, insValue, len, node;
      this.openCurrent();
      if (target != null) {
        target = getValue(target);
      }
      if (value != null) {
        value = getValue(value);
      }
      if (Array.isArray(target)) {
        for (i = 0, len = target.length; i < len; i++) {
          insTarget = target[i];
          this.instruction(insTarget);
        }
      } else if (isObject(target)) {
        for (insTarget in target) {
          if (!hasProp.call(target, insTarget)) continue;
          insValue = target[insTarget];
          this.instruction(insTarget, insValue);
        }
      } else {
        if (isFunction(value)) {
          value = value.apply();
        }
        node = new XMLProcessingInstruction(this, target, value);
        this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      }
      return this;
    };

    XMLDocumentCB.prototype.declaration = function(version, encoding, standalone) {
      var node;
      this.openCurrent();
      if (this.documentStarted) {
        throw new Error("declaration() must be the first node.");
      }
      node = new XMLDeclaration(this, version, encoding, standalone);
      this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.doctype = function(root, pubID, sysID) {
      this.openCurrent();
      if (root == null) {
        throw new Error("Missing root node name.");
      }
      if (this.root) {
        throw new Error("dtd() must come before the root node.");
      }
      this.currentNode = new XMLDocType(this, pubID, sysID);
      this.currentNode.rootNodeName = root;
      this.currentNode.children = false;
      this.currentLevel++;
      this.openTags[this.currentLevel] = this.currentNode;
      return this;
    };

    XMLDocumentCB.prototype.dtdElement = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDElement(this, name, value);
      this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
      var node;
      this.openCurrent();
      node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
      this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.entity = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, false, name, value);
      this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.pEntity = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDEntity(this, true, name, value);
      this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.notation = function(name, value) {
      var node;
      this.openCurrent();
      node = new XMLDTDNotation(this, name, value);
      this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
      return this;
    };

    XMLDocumentCB.prototype.up = function() {
      if (this.currentLevel < 0) {
        throw new Error("The document node has no parent.");
      }
      if (this.currentNode) {
        if (this.currentNode.children) {
          this.closeNode(this.currentNode);
        } else {
          this.openNode(this.currentNode);
        }
        this.currentNode = null;
      } else {
        this.closeNode(this.openTags[this.currentLevel]);
      }
      delete this.openTags[this.currentLevel];
      this.currentLevel--;
      return this;
    };

    XMLDocumentCB.prototype.end = function() {
      while (this.currentLevel >= 0) {
        this.up();
      }
      return this.onEnd();
    };

    XMLDocumentCB.prototype.openCurrent = function() {
      if (this.currentNode) {
        this.currentNode.children = true;
        return this.openNode(this.currentNode);
      }
    };

    XMLDocumentCB.prototype.openNode = function(node) {
      var att, chunk, name, ref1;
      if (!node.isOpen) {
        if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
          this.root = node;
        }
        chunk = '';
        if (node.type === NodeType.Element) {
          this.writerOptions.state = WriterState.OpenTag;
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<' + node.name;
          ref1 = node.attribs;
          for (name in ref1) {
            if (!hasProp.call(ref1, name)) continue;
            att = ref1[name];
            chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
          }
          chunk += (node.children ? '>' : '/>') + this.writer.endline(node, this.writerOptions, this.currentLevel);
          this.writerOptions.state = WriterState.InsideTag;
        } else {
          this.writerOptions.state = WriterState.OpenTag;
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '<!DOCTYPE ' + node.rootNodeName;
          if (node.pubID && node.sysID) {
            chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            chunk += ' SYSTEM "' + node.sysID + '"';
          }
          if (node.children) {
            chunk += ' [';
            this.writerOptions.state = WriterState.InsideTag;
          } else {
            this.writerOptions.state = WriterState.CloseTag;
            chunk += '>';
          }
          chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
        }
        this.onData(chunk, this.currentLevel);
        return node.isOpen = true;
      }
    };

    XMLDocumentCB.prototype.closeNode = function(node) {
      var chunk;
      if (!node.isClosed) {
        chunk = '';
        this.writerOptions.state = WriterState.CloseTag;
        if (node.type === NodeType.Element) {
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + '</' + node.name + '>' + this.writer.endline(node, this.writerOptions, this.currentLevel);
        } else {
          chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + ']>' + this.writer.endline(node, this.writerOptions, this.currentLevel);
        }
        this.writerOptions.state = WriterState.None;
        this.onData(chunk, this.currentLevel);
        return node.isClosed = true;
      }
    };

    XMLDocumentCB.prototype.onData = function(chunk, level) {
      this.documentStarted = true;
      return this.onDataCallback(chunk, level + 1);
    };

    XMLDocumentCB.prototype.onEnd = function() {
      this.documentCompleted = true;
      return this.onEndCallback();
    };

    XMLDocumentCB.prototype.debugInfo = function(name) {
      if (name == null) {
        return "";
      } else {
        return "node: <" + name + ">";
      }
    };

    XMLDocumentCB.prototype.ele = function() {
      return this.element.apply(this, arguments);
    };

    XMLDocumentCB.prototype.nod = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLDocumentCB.prototype.txt = function(value) {
      return this.text(value);
    };

    XMLDocumentCB.prototype.dat = function(value) {
      return this.cdata(value);
    };

    XMLDocumentCB.prototype.com = function(value) {
      return this.comment(value);
    };

    XMLDocumentCB.prototype.ins = function(target, value) {
      return this.instruction(target, value);
    };

    XMLDocumentCB.prototype.dec = function(version, encoding, standalone) {
      return this.declaration(version, encoding, standalone);
    };

    XMLDocumentCB.prototype.dtd = function(root, pubID, sysID) {
      return this.doctype(root, pubID, sysID);
    };

    XMLDocumentCB.prototype.e = function(name, attributes, text) {
      return this.element(name, attributes, text);
    };

    XMLDocumentCB.prototype.n = function(name, attributes, text) {
      return this.node(name, attributes, text);
    };

    XMLDocumentCB.prototype.t = function(value) {
      return this.text(value);
    };

    XMLDocumentCB.prototype.d = function(value) {
      return this.cdata(value);
    };

    XMLDocumentCB.prototype.c = function(value) {
      return this.comment(value);
    };

    XMLDocumentCB.prototype.r = function(value) {
      return this.raw(value);
    };

    XMLDocumentCB.prototype.i = function(target, value) {
      return this.instruction(target, value);
    };

    XMLDocumentCB.prototype.att = function() {
      if (this.currentNode && this.currentNode.type === NodeType.DocType) {
        return this.attList.apply(this, arguments);
      } else {
        return this.attribute.apply(this, arguments);
      }
    };

    XMLDocumentCB.prototype.a = function() {
      if (this.currentNode && this.currentNode.type === NodeType.DocType) {
        return this.attList.apply(this, arguments);
      } else {
        return this.attribute.apply(this, arguments);
      }
    };

    XMLDocumentCB.prototype.ent = function(name, value) {
      return this.entity(name, value);
    };

    XMLDocumentCB.prototype.pent = function(name, value) {
      return this.pEntity(name, value);
    };

    XMLDocumentCB.prototype.not = function(name, value) {
      return this.notation(name, value);
    };

    return XMLDocumentCB;

  })();

}).call(this);


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.12.7
(function() {
  var NodeType, WriterState, XMLStreamWriter, XMLWriterBase,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NodeType = __webpack_require__(31);

  XMLWriterBase = __webpack_require__(51);

  WriterState = __webpack_require__(52);

  module.exports = XMLStreamWriter = (function(superClass) {
    extend(XMLStreamWriter, superClass);

    function XMLStreamWriter(stream, options) {
      this.stream = stream;
      XMLStreamWriter.__super__.constructor.call(this, options);
    }

    XMLStreamWriter.prototype.endline = function(node, options, level) {
      if (node.isLastRootNode && options.state === WriterState.CloseTag) {
        return '';
      } else {
        return XMLStreamWriter.__super__.endline.call(this, node, options, level);
      }
    };

    XMLStreamWriter.prototype.document = function(doc, options) {
      var child, i, j, k, len, len1, ref, ref1, results;
      ref = doc.children;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        child = ref[i];
        child.isLastRootNode = i === doc.children.length - 1;
      }
      options = this.filterOptions(options);
      ref1 = doc.children;
      results = [];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        child = ref1[k];
        results.push(this.writeChildNode(child, options, 0));
      }
      return results;
    };

    XMLStreamWriter.prototype.attribute = function(att, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.attribute.call(this, att, options, level));
    };

    XMLStreamWriter.prototype.cdata = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.cdata.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.comment = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.comment.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.declaration = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.declaration.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.docType = function(node, options, level) {
      var child, j, len, ref;
      level || (level = 0);
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      this.stream.write(this.indent(node, options, level));
      this.stream.write('<!DOCTYPE ' + node.root().name);
      if (node.pubID && node.sysID) {
        this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
      } else if (node.sysID) {
        this.stream.write(' SYSTEM "' + node.sysID + '"');
      }
      if (node.children.length > 0) {
        this.stream.write(' [');
        this.stream.write(this.endline(node, options, level));
        options.state = WriterState.InsideTag;
        ref = node.children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        this.stream.write(']');
      }
      options.state = WriterState.CloseTag;
      this.stream.write(options.spaceBeforeSlash + '>');
      this.stream.write(this.endline(node, options, level));
      options.state = WriterState.None;
      return this.closeNode(node, options, level);
    };

    XMLStreamWriter.prototype.element = function(node, options, level) {
      var att, child, childNodeCount, firstChildNode, j, len, name, prettySuppressed, ref, ref1;
      level || (level = 0);
      this.openNode(node, options, level);
      options.state = WriterState.OpenTag;
      this.stream.write(this.indent(node, options, level) + '<' + node.name);
      ref = node.attribs;
      for (name in ref) {
        if (!hasProp.call(ref, name)) continue;
        att = ref[name];
        this.attribute(att, options, level);
      }
      childNodeCount = node.children.length;
      firstChildNode = childNodeCount === 0 ? null : node.children[0];
      if (childNodeCount === 0 || node.children.every(function(e) {
        return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === '';
      })) {
        if (options.allowEmpty) {
          this.stream.write('>');
          options.state = WriterState.CloseTag;
          this.stream.write('</' + node.name + '>');
        } else {
          options.state = WriterState.CloseTag;
          this.stream.write(options.spaceBeforeSlash + '/>');
        }
      } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && (firstChildNode.value != null)) {
        this.stream.write('>');
        options.state = WriterState.InsideTag;
        options.suppressPrettyCount++;
        prettySuppressed = true;
        this.writeChildNode(firstChildNode, options, level + 1);
        options.suppressPrettyCount--;
        prettySuppressed = false;
        options.state = WriterState.CloseTag;
        this.stream.write('</' + node.name + '>');
      } else {
        this.stream.write('>' + this.endline(node, options, level));
        options.state = WriterState.InsideTag;
        ref1 = node.children;
        for (j = 0, len = ref1.length; j < len; j++) {
          child = ref1[j];
          this.writeChildNode(child, options, level + 1);
        }
        options.state = WriterState.CloseTag;
        this.stream.write(this.indent(node, options, level) + '</' + node.name + '>');
      }
      this.stream.write(this.endline(node, options, level));
      options.state = WriterState.None;
      return this.closeNode(node, options, level);
    };

    XMLStreamWriter.prototype.processingInstruction = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.processingInstruction.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.raw = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.raw.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.text = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.text.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.dtdAttList = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.dtdAttList.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.dtdElement = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.dtdElement.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.dtdEntity = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.dtdEntity.call(this, node, options, level));
    };

    XMLStreamWriter.prototype.dtdNotation = function(node, options, level) {
      return this.stream.write(XMLStreamWriter.__super__.dtdNotation.call(this, node, options, level));
    };

    return XMLStreamWriter;

  })(XMLWriterBase);

}).call(this);


/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map