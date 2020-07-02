import { window, workspace } from 'vscode';
import { MetadataNode } from '../components/MetadataNode';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import SiteArchiveExportConfiguration from '../documents/SiteArchiveExportConfiguration';
import ExportHelper from '../helpers/ExportHelper';
import OCAPIHelper from '../helpers/OCAPIHelper';
import WebDAVService from '../services/WebDAVService';

/**
 * @class XMLHandler
 * @classdesc - The XMLHandler class can be instantiated for generating XML
 *    from SFCC system object & attribute definitions.
 */
export default class XMLHandler {
  /* Class imports */
  private xmlLib = require('xmlbuilder');
  private webDAVService = new WebDAVService();
  private ocapiHelper = new OCAPIHelper();
  private ExportHelper = new ExportHelper();

  /* Instance members */
  public static NAMESPACE_STRING: string =
    'http://www.demandware.com/xml/impex/metadata/2006-10-31';

  /** A list of System Objects that support the site-specific flag on attributes. */
  public static FIELD_ATTRIBUTE_MAP: object = {
    'order-required-flag': ['Product'],
    'site-specific-flag': [
      'Product', 'Catalog', 'SitePreferences'
    ],
    'visible-flag': ['Product']
  };

  public static readonly MAX_JOB_POLLS: number = 50;
  public static readonly JOB_POLL_INTERVAL: number = 500;

  /**
   * @constructor
   */
  constructor() {
    /** @todo: Setup Instance */
  }

  /* ========================================================================
   * Private Helper Functions
   * ======================================================================== */

  /**
   * Gets the results of a job execution by making calls on a regular interval
   * to check and see if the job execution is complete yet.
   *
   * @param {string} jobId - The id of the job that was executed.
   * @param {string} executionId The Id of the execution action.
   * @return {Promise<boolean>} - A boolean flag indicating if the operation
   *    completed successfully.
   */
  private async getJobExecutionResult(jobId: string, executionId: string): Promise<any> {
    let jobRunning = true;
    let jobSuccess = true;
    let jobExe = null;

    // --- TRY 1 ---
    jobExe = await this.ExportHelper.getJobExecution(jobId, executionId);

    // Check if job is finished & if it completed successfully.
    if (jobExe && jobExe.id && jobExe.job_id && jobExe.status) {
      jobRunning = jobExe.status.toUpperCase() === 'PENDING' ||
        jobExe.status.toUpperCase() === 'RUNNING';
    } else {
      window.showWarningMessage('Error getting job execution result from OCAPI - try 1');
    }

    /** @function sleep - Promisify the setTimeout method. */
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Retry API call until job complete, max calls, or an error.
    let i = 2;
    while (jobRunning && i < XMLHandler.MAX_JOB_POLLS) {
      console.log('Job execution not complete - trying again (' + i + ' try)');
      await sleep(XMLHandler.JOB_POLL_INTERVAL);

      // Retry call to check if job is completed.
      jobExe = await this.ExportHelper.getJobExecution(jobId, executionId);

      if (jobExe && jobExe.id && jobExe.job_id && jobExe.status) {
        jobRunning = jobExe.status.toUpperCase() === 'PENDING' ||
          jobExe.status.toUpperCase() === 'RUNNING';
        jobSuccess = jobExe.status.toUpperCase === 'OK';
      } else {
        jobSuccess = false;
        jobRunning = false;
      }

      i++;
    }

    // If there was an error show a message and return.
    if (!jobSuccess) {
      window.showErrorMessage('Error getting job execution result from OCAPI');
    }

    return Promise.resolve(jobSuccess);
  }

  private getObjectGroupXML(rootNode: any,
    systemObjectType: string,
    objectAttributeGroup: ObjectAttributeGroup
  ) {
    // Create the XML tree.
    const groupDefinitionsNode = rootNode
      .ele('type-extension', { 'type-id': systemObjectType })
      .ele('group-definitions');

    // Create the group-definition node.
    const groupNode = groupDefinitionsNode.ele('attribute-group', {
      'group-id': objectAttributeGroup.id
    });

    // Add the display-name node.
    groupNode.ele(
      'display-name',
      { 'xml:lang': 'x-default' },
      objectAttributeGroup.displayName
    );

    // Loop through the attributes in the group and create a node for each.
    if (objectAttributeGroup.attributeDefinitions.length) {
      objectAttributeGroup.attributeDefinitions.forEach(attr => {
        groupNode.ele('attribute', { 'attribute-id': attr.id });
      });
    }
  }

  /**
   * Gets the XML node for an ObjectAttributeDefinition class instance.
   *
   * @private
   * @param {Object} rootNode - The root node that can be used for building the
   *    necessary child XML.
   * @param {string} systemObjectType - The system object that the attribute
   *    will be added to.
   * @param {MetadataNode} element - The MetadataNode that was selected.
   */
  private async getObjectAttributeXML(rootNode: any,
    systemObjectType: string,
    element: MetadataNode
  ) {
    let attribute = element.objectAttributeDefinition;
    const valType = attribute.valueType.toLocaleLowerCase();

    // Check if the attribute is an Enum type.
    if (valType.indexOf('enum') > -1) {
      // Call OCAPI to get the value definitions of the attribute.
      const attrAPIObj = await this.ocapiHelper.getExpandedAttribute(element);

      if (attrAPIObj) {
        attribute = new ObjectAttributeDefinition(attrAPIObj);
      }
    }

    // Create the XML tree.
    const attrDefsNode = rootNode
      .ele('type-extension', { 'type-id': systemObjectType })
      .ele('custom-attribute-definitions');

    // Create the attribute definition node.
    const attrDefNode = attrDefsNode.ele('attribute-definition', {
      'attribute-id': attribute.id
    });

    /* ======================================================================
     * Define Attribute Properties - Dependent on Order
     * ====================================================================== */

    attrDefNode.ele(
      'display-name',
      { 'xml:lang': 'x-default' },
      attribute.displayName.default
    );
    attrDefNode.ele(
      'description',
      { 'xml:lang': 'x-default' },
      attribute.description.default
    );
    attrDefNode.ele('type', attribute.valueType.replace(/[_]/g, '-'));
    attrDefNode.ele('localizable-flag', attribute.localizable);

    if (XMLHandler.FIELD_ATTRIBUTE_MAP['site-specific-flag']
      .indexOf(systemObjectType) > -1
    ) {
      attrDefNode.ele('site-specific-flag',
        attribute.siteSpecific && !attribute.localizable);
    }

    /** @todo: Add the searchable flag to the XML output. */

    attrDefNode.ele('mandatory-flag', attribute.mandatory);

    if (XMLHandler.FIELD_ATTRIBUTE_MAP['visible-flag']
      .indexOf(systemObjectType) > -1
    ) {
      attrDefNode.ele('visible-flag', attribute.visible);
    }

    attrDefNode.ele('externally-managed-flag', attribute.externallyManaged);

    if (XMLHandler.FIELD_ATTRIBUTE_MAP['order-required-flag']
      .indexOf(systemObjectType) > -1
    ) {
      attrDefNode.ele('order-required-flag', attribute.orderRequired);
    }

    attrDefNode.ele('externally-defined-flag', attribute.externallyDefined);

    /** Define properties that are specific to certain value types. */
    if (valType.toLowerCase() === 'string') {
      // Set min-length for String attributes.
      attrDefNode.ele({ 'min-length': attribute.minLength });
    } else if (valType.indexOf('enum') > -1 &&
      attribute.valueDefinitions &&
      attribute.valueDefinitions.length
    ) {
      // Add any value-definitions that are configured for the attribute.
      const valDefs = attrDefNode.ele('value-definitions');
      attribute.valueDefinitions.forEach(valDef => {
        if (valDef.displayValue && valDef.value) {
          const valDefXML = valDefs.ele('value-definition');
          valDefXML.ele('display',
            { 'xml:lang': 'x-default' },
            valDef.displayValue.default
          );

          valDefXML.ele('value', valDef.value.toString());
        }
      });
    }

    if (typeof attribute.defaultValue !== undefined &&
      attribute.defaultValue.value
    ) {
        attrDefNode.ele('default-value', attribute.defaultValue.value);
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
  public async getXMLFromNode(metaNode: MetadataNode) {
    const systemObjectType = metaNode.parentId.split('.').pop();

    // Create the XML document in memory for modification.
    const rootNode = new this.xmlLib.create('metadata', {
      encoding: 'utf-8'
    }).att('xmlns', XMLHandler.NAMESPACE_STRING);

    if (metaNode.nodeType === 'objectAttributeDefinition') {
      await this.getObjectAttributeXML(rootNode, systemObjectType, metaNode);
    } else if (metaNode.nodeType === 'objectAttributeGroup') {
      this.getObjectGroupXML(rootNode, systemObjectType,
        metaNode.objectAttributeGroup);
    }

    // Create the text document and show in the editor.
    workspace
      .openTextDocument({
        language: 'xml',
        content: rootNode.end({ allowEmpty: false, pretty: true })
      })
      .then(doc => {
        window.showTextDocument(doc);
      });
  }

  /**
   * Creates a new file in the editor and populates it with the full xml export
   * of the system object definitions from the configured SFCC isntance.
   *
   * @param {MetadataNode} metaNode - The tree node instance.
   */
  public async getFullXML(metaNode: MetadataNode) {
    const path = require('path');
    const AdmZip = require('adm-zip');
    const saeConfig = new SiteArchiveExportConfiguration();

    // Setup the call POST data.
    if (metaNode.baseNodeName && metaNode.baseNodeName === 'systemObjectDefinitions') {
      saeConfig.dataUnits.globalData.systemTypeDefinitions = true;
      saeConfig.dataUnits.catalogStaticResources = { all: false };
      saeConfig.dataUnits.catalogs = { all: false };
      saeConfig.dataUnits.customerLists = { all: false };
      saeConfig.dataUnits.inventoryLists = { all: false };
      saeConfig.dataUnits.libraries = { all: false };
      saeConfig.dataUnits.libraryStaticResources = { all: false };
      saeConfig.dataUnits.priceBooks = { all: false };
      saeConfig.dataUnits.sites = { all: false };
    }

    const executionResult = await this.ExportHelper.runSystemExport(saeConfig);

    if (executionResult.id && executionResult._type === 'job_execution' && executionResult.job_id) {
      const exportSuccess = await this.getJobExecutionResult(executionResult.job_id, executionResult.id);

      if (!exportSuccess) {
        window.showErrorMessage('There was an error running the system export job');
      } else {
        window.showInformationMessage('Export completed successfully, retrieving file from webdav...');
        const exportPath = 'https://{0}/on/demandware.servlet/webdav/Sites/Impex/src/instance/sfccMetaExplorerExport.zip';
        const rawFile = await this.webDAVService.getFileFromServer(exportPath);
        window.showInformationMessage('sfccExport.zip succussfully downloaded to project root folder');

        // Un-zip the archive.
        const filePath = workspace.workspaceFolders[0].uri.toString().substring(8) + path.sep + 'sfccExport.zip';
        const zip = new AdmZip(filePath);
        const zipEntries = zip.getEntries();
        if (zipEntries && zipEntries.length) {
          zipEntries.forEach(function(zipEntry) {
            if (zipEntry.name === 'system-objecttype-extensions.xml') {
              // Create the text document and show in the editor.
              workspace.openTextDocument({
                  language: 'xml',
                  content: zipEntry.getData().toString('utf8')
              })
              .then(doc => {
                window.showTextDocument(doc);
              });
            }
          });
        } else {
          window.showErrorMessage('There was an error unzipping the archive');
        }
      }
    } else {
      window.showErrorMessage('There was an error triggering the system export job');
    }
  }
}
