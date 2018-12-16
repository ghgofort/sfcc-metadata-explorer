'use strict';

/**
 * @file INodeData.ts
 * @file - Exports an interface that defines the possible types passed as
 *    the third 'associatedData' parameter when creating new MetadataNode
 *    instances. This data object is used to determine if the node is expandable
 *    and what (if any) child nodes need to be fetched.
 */

import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';
import ObjectAttributeValueDefinition from '../documents/ObjectAttributeValueDefinition';

/** @interface INodeData */
export default interface INodeData {
    parentId: string;
    objectAttributeDefinition?: ObjectAttributeDefinition;
    objectAttributeGroup?: ObjectAttributeGroup;
    objectAttributeValueDefinition?: ObjectAttributeValueDefinition;
    objectTypeDefinition?: ObjectTypeDefinition;
    parentContainer?: string;
    baseNodeName?: string;
    nodeValue?: string|number;
}