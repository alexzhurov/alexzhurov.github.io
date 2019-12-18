/**
 * Get html element as a string
 * @param {HTMLElement} node - html element
 * @return {string}
 * @static
 */
export const getStringByNode = (node) => {
    const tmp = document.createElement('div');
    tmp.appendChild(node);
    return tmp.innerHTML.trim();
};
