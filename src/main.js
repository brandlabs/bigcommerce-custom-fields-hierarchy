import Node from './Node';
import {insert} from './utils';

export const delimiter = ' \\ ';

/**
 * Checks whether namespace exists and matches the custom field namespace
 * @param {Object} field
 * @param {string} namespace - user provided namespace
 * @returns {Boolean}
 */
const belongsToNamespace = (field, namespace) => namespace && field.name.trim().startsWith(namespace);

/**
 * Removes namespace from all of the custom fields
 * @param {Array} customFields
 */
const removeNamespaces = (customFields) => customFields.map(field => field.substring(field.indexOf(delimiter)+delimiter.length));

/**
 * Get node formatted path
 * @param {Object} node
 */
const getPath = (node) => node.path.trim();

/**
 * Checks if a node list contains a certain node
 * @param {Array} nodeList
 * @param {Object} childNode
 */
const nodeExists = (nodeList, childNode) => nodeList.some(rootNode => getPath(rootNode) === getPath(childNode))

/**
 * Get the unique custom fields sorted based on the initial order and filtered based on the provided namespace
 * @param {Array} products
 * @param {string} namespace
 */
function formatCustomFields(products, namespace) {
    return products.reduce((fields, product) => {
        product.custom_fields.forEach((field, index) => {
            if (!fields.includes(field.name) && belongsToNamespace(field, namespace)) {
                fields = insert(fields, index, field.name);
            }
        });
        return fields;
    }, []);
}

class CustomFieldsHierarchy {
    constructor(customFields) {
        this.customFields = customFields;
        this.hierarchy = [];

        this.constructHierarchy();
    }

    getHierarchy() {
        return this.hierarchy;
    }

    constructHierarchy() {
        this.customFields.forEach((field) => this.populateHierarchy(field));
    }

    /**
     * Recursively traverses the hierarchy until it finds the desired parent node
     * @param {string} parentPath
     * @param {Array} nodeList
     * @returns {Node}
     */
    getParent(parentPath, nodeList) {
        for (const currentNode of nodeList) {
            if (parentPath.trim() === getPath(currentNode)) {
                return currentNode;
            }

            const parent = this.getParent(parentPath, currentNode.children);
            if (parent) {
                return parent;
            }
        }
    }

    /**
     * Adds all the nodes to the hierarchy
     * @param {string} fullPath
     */
    populateHierarchy(fullPath) {
        const fields = fullPath.split(delimiter);

        fields.forEach((field, index) => {
            const currentPath = fields.slice(0, index + 1);
            const node = new Node(field, currentPath.join(delimiter), []);

            if (index === 0 && !nodeExists(this.hierarchy, node)) {
                this.hierarchy.push(node);
            } else {
                this.populateChildren(fields, index, node);
            }
        });
    }

    /**
     * Adds all the child nodes to the hierarchy
     * @param {Array} fields
     * @param {number} index
     * @param {Node} node
     */
    populateChildren(fields, index, node) {
        const parentPath = fields.slice(0, index).join(delimiter);
        const parentNode = this.getParent(parentPath, this.hierarchy);

        if (parentNode && !nodeExists(parentNode.children, node)) {
            parentNode.children.push(node);
        }
    }
}

/**
 * Transforms products custom fields paths into Javascript object
 * @param {Array}   products - products that are coming from BigCommerce context
 * @param {string}  namespace - only transform custom fields which have this namespace
 * @returns {Array}
 */
export default function transformPathToHierarchy(products, namespace) {
    const customFields = removeNamespaces(formatCustomFields(products, namespace));
    const hierarchy = new CustomFieldsHierarchy(customFields);

    return hierarchy.getHierarchy();
}
