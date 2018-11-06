
import ObjectTypeDefinition from '../documents/ObjectTypeDefinition';
import ObjectAttributeGroup from '../documents/ObjectAttributeGroup';
import ObjectAttributeDefinition from '../documents/ObjectAttributeDefinition';

'use strict';

/**
 * INodeData.ts
 *
 * Describes an interface for a MetadataNode class instances associated data
 * object that represents a system or custom object, and object attribute group,
 * or an object attribute definition.
 */

export default interface INodeData {
    objectAttributeDefinition?: ObjectAttributeDefinition,
    obtectAttributeGroup?: ObjectAttributeGroup,
    objectTypeDefinition?: ObjectTypeDefinition
    nodeValue?: string|number
}