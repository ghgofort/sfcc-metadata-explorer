# Change Log

All notable changes to the "sfcc-metadata-explorer" extension will be documented in this file.

## 0.6.0 (7/15/19)
### Patch Release
- Fix for improper lexical versioning due to publishing from the wrong branch on multiple occassions.
- Fix for enum value type formatting when getting the XML for an attribute.
- Fix for package vulnerability by updating the version of lodash.

## 0.5.0 (6/5/19)
### Minor Release
- Fixed package vulnerability for dependency package.
- Add Mocha to dependencies in package.json.

## 0.4.2 (4/30/19)
### Patch Release
- Fixed the ordering of the custom attribute properties in order to make the XML validate when using the getXML commands.
- Updated README.md & CHANGELOG.md files.

## 0.4.1 (4/28/19)
### Patch Release
- Added command `extension.sfccexplorer.groupattributedefinition.removefromgroup` to remove an attribute from an attribute group to the package.json.
- Added new context type `groupAttribute` for MetadataNode to identify when an attribute child of an attribute group is in scope in the explorer for sub-menu commands.
- Added listener for new command to the extension.ts file which calls the helper in the  OCAPIHelper class to make an API call.
- Added new helper method to the `OCAPIHelper` class to make the call to the OCAPI service to remove the attribute from the group.
- Updated README.md & CHANGELOG.md files.

## 0.4.0 (4/27/19)
### Minor Release
- Added command to get the XML for an attribute group.

## 0.3.2 (4/26/19)
### Patch Release
- Updates to README.md to make it more concise and up-to-date.
- Addded logo icon for extension and listed it under the icon field in the package.json file.
- Changed maximum attribute count to 500 to avoid not getting full attribute list.
- Updated CHANGELOG.md.

## 0.3.1 (4/24/19)
### Patch Release
- Changed `main` field in package.json to reflect new directory for compiled extension after adding webpack for bundling.
- Updated CHANGELOG.md

## 0.3.0
### Beta Release - V3
- Added webpack for bundling extension before publishing.
- Added avj as dev dependency to satisfy peer dependencies.
- Added ts-loader as dev dependency for bundling the TypeScript.
- Added uglifyjs-webpack-plugin as dev dependency in package.json
- Updated the .vscodeignore file to ensure that all un-needed files are excluded from the extension package.
- Updated CHANGELOG.md.

## 0.2.17
### Patch Release
- Updates to README.md & CHANGELOG.md.
- Added view of Custom Object Definitions as a base node of the tree. The functionality of these is limited to viewing the actual object names & attribute groups/definitions count. This is a limitation of the current OCAPI functionality.
- Fixed bug keeping System Object Definitions from being expandable.
- Fixed some error messaging bugs.

## 0.2.5
### Patch Release
- Fixed bug causing error on calls to 'assign an attribute to a group'.
- Added base node with expandable attribute & group count for custom obj. defs. The full display is on hold until there is a proper way found to do this with the OCAPI APIs.
- Added api configuration seciton for custom object definition calls.
- Added VSCode configuration option to enable/disable the custom object defintions node in the metadata tree.
- Added code to MetadataViewProvider.ts tree data provider class to show the custom object defintion base node if the option is endabled.

## 0.2.4
### Patch Release
- Patch fixes for missing XML namespace on xml output and missing encoding type.

## 0.2.3
### Patch Release
- Patch fixes for removing console logging and displaying error messages to the user instead.

## 0.2.2
### Patch Release
- Patch fixes.

## 0.2.1
### Patch Release
- Patch fixes for bad call to create system attributes of certain data types.

## 0.2.0
### Beta Release - V2
- Added context menu action to get the XML from a system object attribute in the explorer tree.
- Removed debug logging.
- Fixed issue keeping error messages from showing for the user when an API call fails.

## 0.1.0
### Initial Beta Release
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
