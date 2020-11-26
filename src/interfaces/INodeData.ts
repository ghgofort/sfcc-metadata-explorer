'use strict';

/**
 * @file INodeData.ts
 * @file - Exports an interface that defines the possible types passed as
 *    the third 'associatedData' parameter when creating new MetadataNode
 *    instances. This data object is used to determine if the node is expandable
 *    and what (if any) child nodes need to be fetched.
 */

import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import ObjectAttributeValueDefinition from '../documents/ObjectAttributeValueDefinition';
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import Site from '../documents/Site';

/** @interface INodeData */
export interface INodeData {
  [key: string]: any;
  parentId: string;
  groupAttribute?: string;
  objectAttributeDefinition?: ObjectAttributeDefinition;
  objectAttributeGroup?: ObjectAttributeGroup;
  objectAttributeValueDefinition?: ObjectAttributeValueDefinition;
  objectAttributeValueDefinitions?: ObjectAttributeValueDefinition[];
  objectTypeDefinition?: ObjectTypeDefinition;
  stringList?: string[];
  parentContainer?: string;
  baseNodeName?: string;
  nodeValue?: string | number;
  displayDescription?: string;
  rootTree?: string;
  site?: Site;
  preferenceValue?: IPreferenceValue;
}

export interface INodeTypes {
  [key: string]: string;
  attribute: string;
  attributeValue: string;
  attributeValues: string;
  baseNodeName: string;
  definition: string;
  group: string;
  groupAttribute: string;
  parentContainer: string;
  preferenceValue: string;
  sitePreference: string;
  sites: string;
  stringList: string;
  value: string;
}

/** @interface IPreferenceValue */
export interface IPreferenceValue {
  id: string;
  type: string;
  enumValues?: string[] | number[];
  objectAttributeDefinition: ObjectAttributeDefinition;
}

export interface IPreferenceValueDefinition {
  site: Site;
  valueDefinition?: ObjectAttributeValueDefinition;
}
