# sfcc-metadata-explorer README

This extension consists of a tree view in the explorer to navigate through your sandbox metadata. There are several actions that can be applied to any given piece of metadata in order to read & modify the metadata in your sandbox.

This extension provides Sales Force Comerce Cloud (SFCC) developers with an alternate method for manipulating the metadata for system and custom objects defined on a SFCC instance. While there are several features in the works, this is still in the early development phases and is a bit rough around the edges. If you find bugs, please log them to the github repository and I will do my best to fix. [Issues on Github.com](https://github.com/ghgofort/sfcc-metadata-explorer/issues)

## Requirements for Use
- A Sales Force Commerce Cloud (SFCC) sandbox instance is required. Obvious, I know!
- A __dw.json__ configuration file is required to setup the connection to your SFCC sandbox isntance(s). This is in a format also used by the Prophet Debugger VSCode extension [1], and dwupload [2]
- You must configure your Open Commerce API settings to allow access for the API calls that are needed.

## VSCode Settings
* extension.sfccmetadata.explorer.systemobjects - Enable/disable the view of system object definitions in the explorer view. __default: true__
* extension.sfccmetadata.explorer.customobjects - Enable/disable the view of custom object definitions in the explorer view. __default: true__

### Open Commerce API Access Setup
In order to make OCAPI calls to a SFCC instance you need to setup access to the desired API calls in Business Manager > Application > Site Development > Open Commerce API Settings. Currently this extension only uses the Data API, and access does not need to be setup for the Meta, or Shop APIs. The included example allows access to all resources, but could be modified only allow the calls that are needed.

_Example OCAPI Access Config_
```json
{
   "_v":"19.1",
   "clients": [
      {
         "client_id":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
         "resources": [
            {
               "resource_id":"/**",
               "methods":["get","put","post","patch","delete"],
               "read_attributes":"(**)",
               "write_attributes":"(**)"
            }
         ]
      }
   ]
}
```

### dw.json Configuration File
SFCC Metadata Explorer requires that you have a _dw.json_ file in the root of your SFCC workspace wich contains the connection information for your sandbox.

_Example dw.json Config_
```json
{
    "code-version": "version1",
    "hostname": "<Your Sandbox URL (example: dev01-na01-domain.demandware.net)>",
    "username": "<Your Sandbox User Name>",
    "password": "<Your Sandbox User Password>"
}
```

The extension is currently setup to use the default OCAPI application ID & password:
   - Default Application ID: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
   - Default Application Password: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

A configuration option to use specific credentials could be added in the future.

## Features
* #### View System Object Definitions
   * View the system object definitions within an SFCC instance.
   * Each system object is expandable to view the attributes that define each object instance.
   * Each attribute is in turn expandable to view information about the attribute, including attribute type, id, display name, etc.
* #### View Custom Object Definitions.
   * Custom objects are currently displayed with a count of the number of attributes, but the OCAPI calls to get additional information on the Object Definitions are not available.
* #### View Attribute Definitions of System Object
   * Each System Object definition node has a child node listing the attribute definitions.
* #### View Attribute Groups of a System Object
   * Each System Object Definition node has a child node listing the attribute groups.
* #### Add Attribute Definition to System Object
   * Each system object attribute has a context menu (right click or CMD+click) with a command to create a new attribute definition.
   * Several inputs are shown to gather information about the new attribute definition:
       * ![Example - add system object attribute definition step 1](/resources/markdown_resources/example_add_definition_step1.png)

       * ![Example - add system object attribute definition step 2](/resources/marddown_resources/example_add_definition_step2.png)
* #### Add Attribute Definition to Group
   * Adds an attribute to the specified attribute group. The user is prompted with a list of the existing attribute groups to select from.
* #### Delete Attribute Definition
   * Removes an attribute definition from a system object definition.
* #### Remove Attribute From Group
   * Removes a system object attribute from the specified attribute group. This can be done from the 'Attribute Groups' sub-tree context menu for each attribute name.
* #### Get Attribute XML
   * Populates a blank editor with the XML from the selected system object attribute.
* #### Get Attribute Group XML
   * Populates a blank editor with the XML for an attribute group and it's member attribute definitions.

These are the only fields required for use of this extension, but many users are likely using the Prophet debugger which requires additional information. The additional fields will be ignored and will not cause any issue with the SFCC Metadata Explorer.

### References:

[1] __Prophet Debugger:__ A VSCode extension for debugging SFCC JavaScript code, watching for code changes and uploading code, as well as viewing log files.

- [**VSCode Marketplace**](https://marketplace.visualstudio.com/items?itemName=SqrTT.prophet)
- [**Github Repository**](https://github.com/sqrtt/prophet)

[2] __dwupload:__ An npm package used to upload files to a SFCC sandbox from the command line.

- [**npm Package**](https://www.npmjs.com/package/dwupload)
- [**Bitbucket Repository**](https://bitbucket.org/demandware/dwupload)

- The Icon for this extension is taken from the the Wikimedia Commons page here: [**File:Pictograms-nps-misc-scenic viewpoint.svg**](https://commons.wikimedia.org/wiki/File:Pictograms-nps-misc-scenic_viewpoint.svg)
- **Attribution:** NPS Graphics, converted by User:ZyMOS [Public domain]

## Known Issues
This is a list of known issues that are results of incompatabilities, or limited scope of work. Issues / Bugs relating to the expected functionality of the extension can be foundon the [**github repository issues page**](https://github.com/ghgofort/sfcc-metadata-explorer/issues).

* The maximum number of attribute that will be fetched is 500. If a system object has more than 500 attributes...whoah?
* The call to get all system object definitions returns all of the system and all of the custom object definitions, but there is not currently an OCAPI call to get a list custom object definitions. When getting the custom objects from the `SystemObjectDefinitions` OCAPI resource, the `object_type` field is listed as *CustomObject* and the `link` field is also a call to get the system object definition for the *CustomObject* type. This leaves no way to get enumerate the custom object definitions because the further details because the ID is needed to make the individual calls to the ocapi CustomObjectDefinitions resource.

-----------------------------------------------------------------------------------------------------------

**Enjoy!**