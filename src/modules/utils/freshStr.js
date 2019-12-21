/**
 * Remove special characters from string
 * @param str
 * @return {string}
 */
export const freshStr = (str) => str.replace(/[^\w\sа-я.,!?()]/gi, '');
