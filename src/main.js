import Node from './Node';
import {insert} from './utils';

const delimiter = '\\';

/**
 * Checks whether namespace exists and matches the custom field namespace
 * @param {string} pathNamespace - custom field namespace
 * @param {string} namespace - user provided namespace
 * @returns {Boolean}
 */
const belongsToNamespace = (field, namespace) => namespace && field.name.trim().startsWith(namespace);

/**
 * Removes namespace from all of the custom fields
 */
const removeNamespaces = (customFields) => customFields.map(field => field.substring(field.indexOf(delimiter)+1));

/**
 * Get the unique custom fields sorted based on the initial order and filtered based on the provided namespace
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

class Tree {
    constructor(customFields) {
        this.customFields = customFields;
        this.hierarchy = [];

        this.constructHierarchy();
    }

    getPath(node) {
        return node.path.trim();
    }

    equals(node1, node2) {
        return this.getPath(node1) === this.getPath(node2);
    }

    findParent(parentPath) {
        for (const currentNode of this.hierarchy) {
            if (parentPath.trim() === this.getPath(currentNode)) {
                return currentNode;
            }
        }
    }

    rootNoteExists(node) {
        return this.hierarchy.some(rootNode => this.equals(rootNode, node));
    }

    populatePath(fullPath) {
        const fields = fullPath.split(delimiter);

        fields.forEach((field, index) => {
            const currentPath = fields.slice(0, index + 1);
            const node = new Node(field, currentPath.join(delimiter), undefined, []);

            if (index === 0 && !this.rootNoteExists(node)) {
                this.hierarchy.push(node);
            } else {
                const parentPath = fields.slice(0, index).join(delimiter);
                const parent = this.findParent(parentPath);
                if (parent) {
                    parent.children.push(node);
                }
            }
        });
    }

    constructHierarchy() {
        this.customFields.forEach((field) => {
            this.populatePath(field);
        });
    }

    getHierarchy() {

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
    const tree = new Tree(customFields);

}

