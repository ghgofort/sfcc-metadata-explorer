# sfcc-metadata-explorer README

## Summary
This extension consists of a tree view in the explorer to navigate through your sandbox metadata. There are several actions that can be applied to any given piece of metadata in order to read & modify the metadata in your sandbox.

This extension provides Sales Force Comerce Cloud (SFCC) developers with an alternate method for manipulating the metadata for system objects defined on a SFCC instance, but the functionality is limited to the most common things that I do as a developer.

If you find bugs, please log them to the github repository and I will do my best to fix. [Issues on Github.com](https://github.com/ghgofort/sfcc-metadata-explorer/issues)

## Requirements for Use
- A Sales Force Commerce Cloud (SFCC) sandbox instance is required. Obvious, I know!
- A __dw.json__ configuration file is required to setup the connection to your SFCC sandbox isntance(s). This is in a format also used by the Prophet Debugger VSCode extension [1], and dwupload [2]
- You must configure your Open Commerce API settings to allow access for the API calls that are needed.

### VSCode Settings
* extension.sfccmetadata.explorer.systemobjects - Enable/disable the view of system object definitions in the explorer view. __default: true__
* extension.sfccmetadata.explorer.customobjects - Enable/disable the view of custom object definitions in the explorer view. __default: true__
* extension.sfccmetadata.explorer.sitepreferences - Enable/disable the view of Site Preferences in the explorer view. __default: true__
* extension.sfccmetadata.ocapi.version - Configure the version of the OCAPI API that you are calling. __default: 20.4__

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

### Sandbox Connection Setup
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
   - Default Application ID: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
   - Default Application Password: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`

A configuration option to use specific credentials could be added in the future.

## Features
### Basic Tree View - View System Object Information
* #### View System Object Definitions
* #### View a list of Custom Object Definitions.
* #### View Attribute Definitions of System Object
* #### View Attribute Groups of a System Object
* #### View Site Preference Configurations by Site.

### Context Menu : System Object : Implemented Edit/Delete Operations
* #### Add Attribute Definition to System Object
* #### Add Attribute Definition to Group
* #### Delete Attribute Group
* #### Delete Attribute Definition
* #### Remove Attribute From Group
* #### Set Site Preference Value.

### Context Menu : System Object : Implemented XML Operations
* #### Get Attribute XML
* #### Get Attribute Group XML

## References:

[1] __Prophet Debugger:__ A VSCode extension for debugging SFCC JavaScript code, watching for code changes and uploading code, as well as viewing log files.

- [**VSCode Marketplace**](https://marketplace.visualstudio.com/items?itemName=SqrTT.prophet)
- [**Github Repository**](https://github.com/sqrtt/prophet)

[2] __dwupload:__ An npm package used to upload files to a SFCC sandbox from the command line.

- [**npm Package**](https://www.npmjs.com/package/dwupload)
- [**Bitbucket Repository**](https://bitbucket.org/demandware/dwupload)

## Attribution:
The Icon for this extension is taken from the the Wikimedia Commons page here: [**File:Pictograms-nps-misc-scenic viewpoint.svg**](https://commons.wikimedia.org/wiki/File:Pictograms-nps-misc-scenic_viewpoint.svg)
- **Attribution:** NPS Graphics, converted by User:ZyMOS [Public domain]

## Known Issues
This is a list of known issues that are results of incompatabilities, or limited scope of work. Issues / Bugs relating to the expected functionality of the extension can be foundon the [**github repository issues page**](https://github.com/ghgofort/sfcc-metadata-explorer/issues).

* The maximum number of attribute that will be fetched is 700. If a system object has more than 700 attributes...whoah?
* The maximum number of attribute groups that will be fetched is 150.
    * @TODO: Update these to VSCode adjustable settings.
* The call to get all system object definitions returns all of the system and all of the custom object definitions, but there is not currently an OCAPI call to get a list custom object definitions. When getting the custom objects from the `SystemObjectDefinitions` OCAPI resource, the `object_type` field is listed as *CustomObject* and the `link` field is also a call to get the system object definition for the *CustomObject* type. This leaves no way to get enumerate the custom object definitions because the further details because the ID is needed to make the individual calls to the ocapi CustomObjectDefinitions resource.

-----------------------------------------------------------------------------------------------------------

**Enjoy!**
