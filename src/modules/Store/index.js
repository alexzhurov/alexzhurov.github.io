/**
 * @typedef calendarDay
 * @param {string} title
 * @param {number} date
 * @param {string} member
 * @param {string} desc
 */

/**
 * @type {calendarDay[]}
 */
import dates                     from '../../mock';
import StorageManager            from '../StorageManager';
import { daysEqual }             from "../utils/daysEqual";
import EventBus                 from '../EventBus';
import { CALENDAR_DATE_CHANGE } from '../Constants/Events';


const St = {
    state: {
        notes: [],
        selectedNotes: [],
        searchedNotes: [],
        selectedDate: null
    },
    actions: {
        init() {
            const prevStore = StorageManager.loadState();
            if (prevStore && prevStore.notes.length > 0) {
                this.state = prevStore;
            } else {
                this.actions.getNotes();
            }
        },
        /*
        addNote
        removeNote
         */
        getNotes() {
            this.state.notes = [...dates].sort((a, b) => {
                if (a.date < b.date) return -1;
                if (a.date > b.date) return 1;
                return 0;
            })
        },
        /**
         * @param {number} month
         * @param {number} fullYear
         */
        getNotesByMonth(month, fullYear) {
            const selectedNotes = [];
            this.state.notes.forEach((day) => {
                const date = new Date(day.date * 1000);
                if (month === date.getMonth() && fullYear === date.getFullYear()) {
                    selectedNotes.push(day);
                }
            });
            this.state.selectedNotes = selectedNotes;
        },

        /**
         * Найти существующую запись
         * @param {Date} date
         * @return {calendarDay|null}
         */
        getNoteByDate(date) {
            const result = this.state.selectedNotes.find(({date: d}) => daysEqual(new Date(d * 1000), date));
            return result ? {...result} : null
        },

        /**
         * @param {string} str
         */
        getNotesByString(str) {
            if (!str) {
                this.state.searchedNotes = []
            } else {
                const notes = [...this.state.notes];
                this.state.searchedNotes = notes.filter(({title}) => title.toLowerCase().includes(str.toLowerCase()));
            }
        },

        /**
         * @param {Date} date
         */
        setDate(date) {
            this.state.selectedDate = date;
            this.bus.notify(CALENDAR_DATE_CHANGE);

        }
    }
};


export default new class Store {
    constructor() {
        const {state, actions} = St;
        this.state = state;
        this.actions = {};
        for (const act in actions) {
            this.actions[act] = (() => (...arg) => {
                const fn = actions[act].bind(this, ...arg);
                const res = fn();
                this.syncStore();
                return res;
            })(this, act, actions)
        }
        this.actions.init();
        this.bus = EventBus;
    }

    /**
     * Save to localstorage on each action
     */
    syncStore() {
        StorageManager.saveState(this.state);
    }
}
