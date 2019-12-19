import './style/index.styl';
import { getNodeByString, removeChilds } from './modules/domUtils';
import Spider                            from './modules/Spider';

import { getWeekDayName }  from './modules/utils/getWeekDayName';
import { daysEqual }       from './modules/utils/daysEqual';
import { truncateText }    from './modules/utils/truncateText';
import { getMonthName }    from './modules/utils/getMonthName';

import { calendarDayFC }   from './components/calendarDay';
import { FastEvent }       from './components/fastEvent';
import { SearchComponent } from './components/search';

/**
 * @property {Date} selectedDate
 * @property {Object.<string, HTMLElement>} entries
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
        this.childrens = {
            fastEvent: new FastEvent(),
            searchComponent: new SearchComponent(this.entries.header)
        };
        this.bindEvents();
        this.selectedDate = (new Date()).setDate(1);

        this.renderDate();
        // this.createCalendar();
        this.entries.header.appendChild(this.childrens.searchComponent.el)
    }

    createCalendar() {
        const month = 11;
        const year = 2019;

        const {days, startDate} = this.getCalendarOptions(month, year);
        // const notes = getNotesByMonth(month, year);

        removeChilds(this.calendar);

        let week;
        let weekIndex = 0;
        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
            if (i % 7 === 0) {
                weekIndex++;
                week && this.calendar.appendChild(week);
                week = getNodeByString(`<div class="calendar__week"></div>`)
            }
            const note = notes.find(({date: d}) => daysEqual(new Date(d * 1000), date));


            const day = calendarDayFC({
                isActive: !!note,
                date: (weekIndex === 1 && getWeekDayName(date) + ', ') + date.getDate(),
                title: note && truncateText(note.title, 30) || '',
                member: note && truncateText(note.member, 45) || ''
            });

            week.appendChild(day);
        }
    }

    bindEvents() {
        this.entries.addFastEvent.addEventListener('click', this.onAddFastEvent.bind(this));
        this.entries.navigationPrev.addEventListener('click', this.onNavigationClick.bind(this, false));
        this.entries.navigationNext.addEventListener('click', this.onNavigationClick.bind(this, true));
        this.entries.navigationToday.addEventListener('click', this.onNavigationToday.bind(this));
    }

    /**
     * @param {number} month
     * @param {number} year
     * @return {{days: number, startDate: Date}}
     */
    getCalendarOptions(month, year) {
        const maxDays = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1);
        const firstWeekDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
        const preDays = firstWeekDay - 1;
        const weeks = Math.ceil((maxDays + preDays) / 7);

        const startDate = new Date(firstDay.getTime());
        startDate.setDate(startDate.getDate() - preDays);

        return {
            days: weeks * 7,
            startDate: new Date(startDate.getTime())
        };
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

    renderDate() {
        const d = new Date(this.selectedDate);
        const month = getMonthName(d);
        this.entries.navigationDate.innerText = `${month} ${d.getFullYear()}`
    }

    // Event handlers
    /**
     * @param {MouseEvent} e
     */
    onAddFastEvent(e) {
        const el = this.entries.addFastEvent;
        const {left, bottom} = el.getBoundingClientRect();
        const popup = this.childrens.fastEvent.el;
        popup.style.left = `${left}px`;
        popup.style.top = `${bottom + 15}px`;

        this.rootNode.appendChild(popup);
    }

    /**
     * @param {boolean} toIncrement
     * @param {MouseEvent} e
     */
    onNavigationClick(toIncrement, e) {
        var d = new Date(this.selectedDate);
        d.setMonth(d.getMonth() + (toIncrement ? 1 : -1));
        this.selectedDate = d;
        this.renderDate();
    }

    /**
     * @param {MouseEvent} e
     */
    onNavigationToday(e) {
        this.selectedDate = (new Date()).setDate(1);
        this.renderDate();
    }

}

