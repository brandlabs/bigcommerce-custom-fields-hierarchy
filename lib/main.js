import Node from './Node';
import {insert} from './utils';

/**
 * Flattens the Hierarchy to only one level
 * @param {Array}  hierarchy
 * @returns {Array}
 */
export function flattenHierarchy(hierarchy) {
    return hierarchy.reduce((finalList, field) => {
        if (field.children) {
            field.children.forEach(el => finalList.push(el));
            return finalList;
        }
        finalList.push(field);
        return finalList;
    }, []);
}

/**
 * @param {Array}  fields
 * @param {string} fieldName
 * @returns {Boolean}
 */
function fieldExists(fields, fieldName) {
    return fields.some((el) => el.name === fieldName);
}

/**
 * Adds the second level of custom fields to the hierarchy
 * @param {Array}  hierarchy
 * @param {string} parentField
 * @param {string} childField
 * @param {number} index
 * @param {string} path
 * @returns {Array}
 */
function populateChildFields(hierarchy, parentField, childField, index, path) {
    if (fieldExists(hierarchy, parentField)) {
        return hierarchy.map((el) => {
            if (el.name === parentField && !fieldExists(el.children, childField)) {
                return new Node(parentField, undefined, [...el.children, new Node(childField, path)]);
            }
            return el;
        });
    }
    return insert(hierarchy, index, new Node(parentField, undefined, [new Node(childField, path)]));
}

/**
 * Adds the first level of custom fields to the hierarchy
 * @param {Array}  hierarchy
 * @param {string} path - a full path of a custom field
 * @param {number} index - used for retaining the order of the custom fields
 * @param {string} namespace
 * @returns {Array}
 */
function populateFields(hierarchy, path, index, namespace) {
    const fields = path.split('/');
    const [pathNamespace, parentField, childField] = fields;

    if (pathNamespace.trim() === namespace) {
        if (!childField && !fieldExists(hierarchy, parentField)) {
            return insert(hierarchy, index, new Node(parentField, path));
        } else if (childField) {
            return populateChildFields(hierarchy, parentField, childField, index, path);
        }
    }
    return hierarchy;
}

/**
 * Transforms products custom fields paths into Javascript object
 * @param {Array}   products - products that are coming from BigCommerce context
 * @param {string}  namespace - only transform custom fields which have this namespace
 * @returns {Array}
 */
export default function transformPathToHierarchy(products, namespace) {
    let hierarchy = [];

    products.forEach((product) => {
        product.custom_fields.forEach((field, index) => {
            hierarchy = populateFields(hierarchy, field.name, index, namespace);
        });
    });

    return hierarchy;
}
