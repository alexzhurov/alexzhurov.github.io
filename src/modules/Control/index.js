import { eachChild, getNodeByString, setHandler, removeChilds } from "../domUtils";

export class Control {
    constructor(rootEl) {
        this.roootEl = rootEl;
        this.setHandler = setHandler.bind(this);
        this.state = {};
    }

    get state() {
        return this._state;
    }

    set state(val) {
        this._state = val;
    }

    _forceUpdate() {
        //     let event = new Event('updateApp', {bubbles: true,});
        //     const el = this.el;
        //     el && el.dispatchEvent(event);
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
        let el = getNodeByString(this.render());
        this.el = this.bindEvents(el);
        // console.log("Control.js => createEl ", this.el);
    }

}
