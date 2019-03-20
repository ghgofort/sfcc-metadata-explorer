# Change Log

All notable changes to the "sfcc-metadata-explorer" extension will be documented in this file.

## Unreleased

## 0.2.0

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