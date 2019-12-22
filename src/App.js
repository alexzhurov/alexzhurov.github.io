import './style/index.styl';
import Spider              from './modules/Spider';
import { DateNav }         from './components/DateNav';
import { FastEvent }       from './components/FastEvent';
import { SearchComponent } from './components/SearchComponent';
import { Calendar }        from './components/Calendar';
import { Modal }           from './components/Modal';


/**
 * @property {Object.<string, Element>} entries
 * @property {Object.<string, Class>} children
 * @property {HTMLElement} calendar - element of the calendar container
 */
export class App extends Spider {
    constructor() {
        super();
        this.rootNode = document.getElementById('App');

        this.beforeMount();
    }

    beforeMount() {
        this.getEntries();
        this.children = {
            fastEvent: new FastEvent(),
            searchComponent: new SearchComponent(this.entries.header),
            dateNav: new DateNav(this.entries.dateNav),
            calendar: new Calendar(this.entries.calendar),
            modal: new Modal(this.rootNode)
        };
        this.bindEvents();
        this.entries.header.appendChild(this.children.searchComponent.el);
        this.entries.dateNav.appendChild(this.children.dateNav.el);
        this.entries.calendar.appendChild(this.children.calendar.el);
    }


    bindEvents() {
        this.entries.addFastEvent.addEventListener('click', this.onAddFastEvent.bind(this));
    }


    /**
     * Get links to node bindings.
     */
    getEntries() {
        this.entries = {};
        document
            .querySelectorAll('[data-id]')
            .forEach((el) => this.entries[el.dataset.id] = el);
    }

    // Event handlers
    /**
     * @param {MouseEvent} e
     */
    onAddFastEvent(e) {
        e && e.stopPropagation();
        const el = this.entries.addFastEvent;
        const {left, bottom} = el.getBoundingClientRect();
        const popup = this.children.fastEvent.el;
        popup.style.left = `${left}px`;
        popup.style.top = `${bottom + 15}px`;

        this.rootNode.appendChild(popup);
    }
}

