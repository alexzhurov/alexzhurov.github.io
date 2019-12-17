/**
 * @param {string|number} str
 * @param {number} length
 * return {string}
 */
export function truncateText(str, length = 45) {
    if (str === null || Number.isNaN(str) || str === undefined || typeof str === 'boolean') return '';

    str = `${str}`;
    if (str.length <= length) {
        return str;
    }
    return str.trim().substring(0, length) + '...'
}
