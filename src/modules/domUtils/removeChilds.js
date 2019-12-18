/**
 * Remove all children of html element
 * @param {HTMLElement} node
 */
export const removeChilds = (node) => {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

