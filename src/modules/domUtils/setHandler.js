const events = {
    onclick: 'click',
    oninput: 'input'
};

/**
 * Change dom attributes bind to event listener for each node
 * @type {HTMLElement} child
 */
export function setHandler(child) {
    for (let attr in events) {
        const ev = events[attr];
        const handler = child.getAttribute(attr);
        if (handler) {
            if (!this[handler]) {
                console.warn(`methodHandler ${handler} doesn't exist in class`, this.constructor.name);
            }
            child.removeAttribute(attr);
            child.addEventListener(ev, this[handler]);
        }
    }
};
