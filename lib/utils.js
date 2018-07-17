/**
 * Inserts a new element in an array at specific index
 * @param {Array} original array
 * @param {number} index
 * @param {*} a new element
 * @returns A shallow copied new array filled with the new element
 */

export function insert(original, index, newElement) {
    const result = original.slice(0);

    result.splice(index, 0, newElement);

    return result;
}
