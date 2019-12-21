import { Control }           from '../../modules/Control';
import EventBus              from "../../modules/EventBus";
import { CALENDAR_DAY_OPEN } from "../../modules/Constants/Events";

/**
 * @typedef  ModalState
 * @type {Object}
 * @property {null} targetId
 * @property {number} elWidth
 * @property {number} elHeight
 * @property {string} title - title of the note
 * @property {Date} date - Data of the note
 * @property {string} member - Members of the note
 * @property {string} desc - Description of the note
 */

export class Modal extends Control {
    constructor(o) {
        super(o);
        this.createEl();

        /**
         * @type {ModalState}
         */
        this.state = {
            targetId: null,
            elWidth: 0,
            elHeight: 0,
            title: '',
            date: null,
            member: '',
            desc: '',
        };
        this.bindHandlers();
        this._forceUpdate();
        // Save size for positioning
        this.state.elWidth = Number(this.el.clientHeight);
        this.state.elHeight = Number(this.el.clientWidth);
        this.el.remove();
    }

    bindHandlers() {
        this.open = this.open.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.bus = EventBus;
        this.bus.subscribe(CALENDAR_DAY_OPEN, this.open);
    }

    open(e) {
        const {el, key} = e.detail;
        // const date = new Date(Number(el.dataset.key));
        /*
        сделать проверку на переоткрытие окна
         */
        this._forceUpdate();
        this.addPosition(el);
        this.roootEl.appendChild(this.el);
    }

    /**
     * Add position for this component element.
     * @param {HTMLElement} target - target for which to position
     */
    addPosition(target) {
        const {top, left, right, bottom} = target.getBoundingClientRect();
        const doc = document.body.getBoundingClientRect();
        const rOffset = window.innerWidth - left;
        const bOffset = window.innerHeight - top;
        const vBoundary = this.state.elWidth + 175;
        const hBoundary = this.state.elHeight;
        const result = {top: 0, left: 0, class: ''};

        // Vertical positioning
        if (vBoundary > rOffset) {
            result.class += 'left';
            result.left = left - this.state.elWidth;
        } else {
            result.class += 'right';
            result.left = right + 12;
        }
        // Horizontal positioning
        if (hBoundary < bOffset) {
            result.class += '-top';
            result.top = top - doc.top - 20;
        } else {
            result.class += '-bottom';
            result.top = bottom - doc.top - this.state.elHeight - 50;
        }
        const {floor, abs} = Math;
        this.el.style.left = `${abs(floor(result.left))}px`;
        this.el.style.top = `${abs(floor(result.top))}px`;
        this.el.classList.add(result.class);
    }

    onClose(e) {
        e && e.stopPropagation();
        this.el.remove();
    }

    onRemove(e) {
        e && e.stopPropagation();
        this.onClose();
    }

    onSubmit(e) {
        e && e.stopPropagation();
        this.onClose();
    }

    render() {
        return (`
<div class="modal">
    <input type="text" class="input modal__input" tabindex="20" placeholder="Событие">
    <input type="text" class="input modal__input" tabindex="20" placeholder="День, месяц, год">
    <input type="text" class="input modal__input" tabindex="20" placeholder="Имена участников"
           style="margin-bottom: 38px">
    <textarea class="modal__area" tabindex="20"
              placeholder="Описание"
    ></textarea>
    <button onclick="onSubmit" class="btn-sm" tabindex="20" style="margin-right: 11px;">Готово</button>
    <button onclick="onRemove" class="btn-sm" tabindex="20">Удалить</button>
    <div onclick="onClose" class="modalClose" tabindex="20" role="button">&times;</div>
</div>
`);
    }
}

