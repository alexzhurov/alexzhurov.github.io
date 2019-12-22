/**
 * Remove all children of html element
 * @param {HTMLElement} node
 */
export const removeChildren = (node) => {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

