# sfcc-metadata-explorer README

This extension consists of a tree view in the explorer to navigate through your sandbox metadata. There are several actions that can be applied to any given piece of metadata in order to modify the metadata in your sandbox.

## Features

This extension provides Sales Force Comerce Cloud (SFCC) developers with an alternate method for manipulating the metadata for system and custom objects defined on a SFCC instance. While there are several features in the works, this is still in the early development phases, and has not been released to the VSCode marketplace yet. If you choose to download the source code and manually build the extension, the functionality is currently limited to the following 'finished features'.

### Finished Work
* #### View System Object Definitions
   * View the system object definitions within an SFCC instance.
   * Each system object is expandable to view the attributes that define each object instance.
   * Each attribute is in turn expandable to view information about the attribute, including attribute type, id, display name, etc.
* #### View Custom Object Definitions.
   * Custom objects are currently displayed within the list of System Objects with the qualifyer '(Custom Object)' printed after the CustomObjectDefinition's Id (see screen capture below).
* #### View Attribute Definitions of System Object
* #### View Attribute Groups of a System Object
* #### Add Attribute Definition to System Object
   * Each system object attribute has a context menu (right click or CMD+click) with a command to create a new attribute definition.
   * Several inputs are shown to gather information about the new attribute definition:
       * ![Example - add system object attribute definition step 1](/resources/markdown_resources/example_add_definition_step1.png)

       * ![Example - add system object attribute definition step 2](/resources/marddown_resources/example_add_definition_step2.png)

## Requirements

- A Sales Force Commerce Cloud (SFCC) sandbox instance is required. Obvious, I know!
- A __dw.json__ configuration file is required to setup the connection to your SFCC sandbox isntance(s). This is in a format also used by the Prophet Debugger VSCode extension [1], and dwupload [2]
- You must configure your Open Commerce API settings to allow access for the API calls that are needed.


### Open Commerce API Access Setup
In order to make OCAPI calls to a SFCC instance you need to setup access to the desired API calls in Business Manager > Application > Site Development > Open Commerce API Settings. Currently this extension only uses the Data API, and access does not need to be setup for the Meta, or Shop APIs. The included example allows access to all resources, but could be modified only allow the calls that are needed (I will include this as an example at a later time).

The extension is currently setup to use the default OCAPI application ID & password:
   - Default Application ID: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
   - Default Application Password: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

A VSCode configuration option to use specific credentials will be added in the future.

_Example OCAPI Access Config_
```json
   {
  "_v":"19.1",
  "clients":
  [
    {
      "client_id":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "resources":
      [
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

These are the only fields required for use of this extension, but many users are likely using the Prophet debugger which requires additional information. The additional fields will be ignored and will not cause any issue with the SFCC Metadata Explorer.

### References:
[1] __Prophet Debugger:__ A VSCode extension for debugging SFCC JavaScript code, watching for code changes and uploading code, as well as viewing log files.

- [**VSCode Marketplace**](https://marketplace.visualstudio.com/items?itemName=SqrTT.prophet)
- [**Github Repository**](https://github.com/sqrtt/prophet)

[2] __dwupload:__ An npm package used to upload files to a SFCC sandbox from the command line.

- [**npm Package**](https://www.npmjs.com/package/dwupload)
- [**Bitbucket Repository**](https://bitbucket.org/demandware/dwupload)

## Extension Settings

The application ID configured for making OCAPI calls must be added to the APIConfig.ts file. This will need to be moved to a more accessible location (not part of the extension's code base) before release of the extension.

## Known Issues
This is a list of known issues that are results of incompatabilities, or limited scope of work. Issues / Bugs relating to the expected functionality of the extension can be foundon the [**github repository issues page**](https://github.com/ghgofort/sfcc-metadata-explorer/issues).

1. The call to get all system object definitions returns all of the system and all of the custom object definitions.
   * This is curerntly handled by adding the string: '(Custom Object)' to the end of the Object ID in order to be able to diferentiate between the two.
   * If time permits, I would like to sort the two into separate base items by using the select parameter to only return the attribute definitions that are needed, or to return them all and simply cache the others until needed.


_Because this extension is still in the initial development, additional issues with compatability or limits to functionality could still be found._

## Release Notes

Preparing for an initial release with the current feature set.

### Updates since last release


### 0.0.1

Initial Beta Release

- Viewing of system object attribute groups is now supported.
- Context menu action has been added to the system objects for adding a new system object attribute.
  - The attribute details are collected through a wizard that gets the value of each field, and then makes a single call to the Open Commerce API to create the new system object attribute definition.
- Display of the system & custom objects has been added.
- Display of the object attributes has been added.
- Display of the object attribute values has been added.
- The TreeView provider has been added.
- Added context menu option to assign a System Object Attribute to an attribute group.
- Added context menu option to delete a custom attribute from a System Object.
- Added a view menu command to refresh the tree data.
-----------------------------------------------------------------------------------------------------------

**Enjoy!**