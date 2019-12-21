/**
 * @typedef calendarDay
 * @param {string} title
 * @param {number} date - key value Date / 1000
 * @param {string} member
 * @param {string} desc
 */
/**
 * @typedef {Object} calendarDayParsed - An object.
 * @property {Date}  date
 * @property {string}  title
 * @property {string}  member
 * @property {string}  desc
 */

/**
 * @type {calendarDay[]}
 */
import dates                                           from '../../mock';
import StorageManager                                  from '../StorageManager';
import { daysEqual }                                   from "../utils/daysEqual";
import { delayFn }                                     from '../utils/delayFn';
import EventBus                                        from '../EventBus';
import { CALENDAR_DATE_CHANGE, CALENDAR_NOTE_CHANGED } from '../Constants/Events';


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
                this.state.selectedDate = new Date();
            }
        },
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
            if (str) {
                const notes = [...this.state.notes];
                this.state.searchedNotes = notes.filter(({title}) => title.toLowerCase().includes(str.toLowerCase()));
            } else {
                this.state.searchedNotes = []
            }
        },

        /**
         * @param {Date} date
         */
        setDate(date) {
            this.state.selectedDate = date;
            this.bus.notify(CALENDAR_DATE_CHANGE);
        },

        /**
         * @param {calendarDayParsed} day
         */
        saveNote(day) {
            if (!(day.date instanceof Date)) {
                throw new Error('Тип аргумента даты не верный')
            }
            const exist = this.actions.getNoteByDate((day.date));
            const normalized = {
                ...day,
                date: Number(day.date) / 1000
            };
            if (exist) {
                this.actions.removeNote(normalized.date);
            }
            this.state.notes.push(normalized);
            this.bus.notify(CALENDAR_NOTE_CHANGED);
        },

        /**
         * @param{number} dateNormalized - Date / 1000
         */
        removeNote(dateNormalized) {
            const resetTime = (date) => ((new Date(date * 1000)).setHours(0, 0, 0, 0) / 1000);
            this.state.notes = this.state.notes.filter((note) => resetTime(note.date) !== dateNormalized);
            this.bus.notify(CALENDAR_NOTE_CHANGED);
        }
    }
};


/**
 * Singleton of store
 */
const Store = new class StoreCreator {
    constructor() {
        const {state, actions} = St;
        this.state = state;
        this.actions = actions;

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
     * Save to localstorage on each action with delay
     */
    syncStore() {
        delayFn(() => {
            StorageManager.saveState(this.state)
        }, 200)
    }
};

export default Store
