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


export default interface INodeData {
    objectAttributeDefinition?: ObjectAttributeDefinition,
    obtectAttributeGroup?: ObjectAttributeGroup,
    objectAttributeValueDefinition?: ObjectAttributeValueDefinition;
    objectTypeDefinition?: ObjectTypeDefinition
    nodeValue?: string|number
}