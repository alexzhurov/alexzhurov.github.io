import { Control }           from '../../modules/Control';
import EventBus              from "../../modules/EventBus";
import { CALENDAR_DAY_OPEN } from "../../modules/Constants/Events";
import Store                 from "../../modules/Store";
import { getFullDate }       from "../../modules/utils/getFullDate";


/**
 * @typedef  ModalState
 * @type {Object}
 * @property {string} key
 * @property {boolean} isExist
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

        this.resetState();
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
        this.onInput = this.onInput.bind(this);
        this.bus = EventBus;
        this.bus.subscribe(CALENDAR_DAY_OPEN, this.open);
    }

    resetState() {
        /**
         * @type {ModalState}
         */
        this.state = {
            key: null,
            isExist: false,
            elWidth: this.state && this.state.elWidth || 0,
            elHeight: this.state && this.state.elHeight || 0,
            title: '',
            date: '',
            member: '',
            desc: '',
        }
    }

    open(e) {
        const {el, key} = e.detail;
        if (this.state.key !== key) {
            this.resetState();
            this.state.key = key;
            this.state.isExist = el.dataset.exist === 'true';
            if (this.state.isExist) {
                const date = new Date(Number(key));
                const note = Store.actions.getNoteByDate(date);
                const d = new Date(note.date * 1000);
                this.state = {
                    ...this.state,
                    ...note,
                    date: `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`
                };
            }
            this._forceUpdate();
            this.addPosition(el);
        }
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
        const dateNormalized = Number(this.state.key / 1000);
        Store.actions.removeNote(dateNormalized);
        this.onClose();
    }

    onSubmit(e) {
        e && e.stopPropagation();
        const {date: d, title, member, desc} = this.state;
        const date = getFullDate(d);

        Store.actions.saveNote({date, title, member, desc,});
        this.onClose();
    }

    /**
     * @param {InputEvent} e
     */
    onInput(e) {
        e & e.stopPropagation();
        const state = e.target.dataset.state;
        const val = e.target.value;
        this.state[state] = val
    }

    render() {
        if (!this.state) {
            return `<div></div>`
        }
        return (`
<div class="modal">
    <input type="text" oninput="onInput" data-state="title" value="${this.state.title}" class="input modal__input" tabindex="20" placeholder="Событие">
    <input type="text" oninput="onInput" data-state="date" value="${this.state.date}" class="input modal__input" tabindex="20" placeholder="День, месяц, год">
    <input type="text" oninput="onInput" data-state="member" value="${this.state.member}" class="input modal__input" tabindex="20" placeholder="Имена участников"
           style="margin-bottom: 38px">
    <textarea oninput="onInput" data-state="desc" class="modal__area" tabindex="20"
              placeholder="Описание">${this.state.desc}</textarea>
    <button onclick="onSubmit" class="btn-sm" tabindex="20" style="margin-right: 11px;">Готово</button>
    ${this.state.isExist ?
            `<button onClick="onRemove" class="btn-sm" tabIndex="20">Удалить</button>` : ''}
    <div onclick="onClose" class="modalClose" tabindex="20" role="button">&times;</div>
</div>
`);
    }
}

