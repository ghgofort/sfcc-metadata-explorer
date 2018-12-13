# sfcc-metadata-explorer README

This extension consists of a tree view in the explorer to navigate through your sandbox metadata. There are several actions that can be applied to any given piece of metadata in order to modify the metadata in your sandbox.

## Features

This extension provides Sales Force Comerce Cloud (SFCC) developers with an alternate method for manipulating the metadata for system and custom objects defined on a SFCC instance. While there are several features in the works, this is still in the early development phases, and has not been released to the VSCode marketplace yet. If you choose to download the source code and manually build the extension, the functionality is currently limited to the following 'finished features'.

### Finished Work
* #### View existing System Object definitions within an SFCC instance (Example: dw.catalog.Product SystemObject).
* #### A user can view Custom Object definitions. (Example: Power Reviews cartridge defines custom object PowerReviewsCO). Custom objects are currently displayed within the list of System Objects with the qualifyer '(Custom Object)' printed after the CustomObjectDefinition's Id.
* #### A user can view the definitions for attributes of a system object.
* #### A user can see the values for the attribute definitions fields (i.e. Attribute type is string).
* #### Users can add new system object attributes through the context menu of the SystemObjectDefinition item in the tree
   * ![Example - add system object attribute definition](/resources/markdown_resources/example_add-attribute-definition.png)

## Requirements

- A Sales Force Commerce Cloud (SFCC) sandbox instance is required. Obvious, I know!
- A __dw.json__ configuration file is required to setup the connection to your SFCC sandbox isntance(s). This is in a format also used by the Prophet Debugger VSCode extension [1], and dwupload [2]

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

### Updates since last release


- Context menu action has been added to the system objects for adding a new system object attribute.
  - The attribute details are collected through a wizard that gets the value of each field, and then makes a single call to the Open Commerce API to create the new system object attribute definition.
- Display of the system & custom objects has been added.
- Display of the object attributes has been added.
- Display of the object attribute values has been added.
- The TreeView provider has been added.

The beta release for the extension is still in the works. Visit this page for updates on the progress.

### 1.0.0

Initial release comming soon...

-----------------------------------------------------------------------------------------------------------

**Enjoy!**