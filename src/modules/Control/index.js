import { eachChild, getNodeByString, setHandler, removeChilds } from "../domUtils";

export class Control {
    constructor(rootEl) {
        this.roootEl = rootEl;
        this.setHandler = setHandler.bind(this);
    }

    _forceUpdate() {
        if (this.el) {
            removeChilds(this.el);
            this.el.remove();
        }
        this.createEl();
        this.roootEl.append(this.el);
    }


    /**
     * onClick
     * onInput
     * @param {HTMLElement} el
     */
    bindEvents(el) {
        eachChild(el, this.setHandler);
        return el;
    }

    createEl() {
        if (!this.render) return;
        const el = getNodeByString(this.render());
        this.el = this.bindEvents(el);
    }

}
