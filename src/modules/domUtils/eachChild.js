/**
 * Execute callback for each child node recursively
 * @param {HTMLElement} el
 * @param {function(HTMLElement)} callback
 */
export const eachChild = (el, callback) => {
    for (let child of el.children) {
        callback && callback(child);
        if (child.childElementCount !== 0) {
            eachChild(child, callback);
        }
    }
};
