import './style/index.styl';
import Spider from './modules/Spider';
import Renderer from './modules/Renderer';
import {getWeekDayName} from './modules/Utils/getWeekDayName';
import {daysEqual} from './modules/Utils/daysEqual';


/**
 * @type {calendarDay[]}
 */
import dates from './mock';

/**
 * calendarDay
 * @typedef {Object} calendarDay
 * @property {string} title
 * @property {number} date
 * @property {string} member
 * @property {string} desc
 */

/**
 * @property {Node} templates - root element with templates
 */
class NodeGenerator extends Spider {
    constructor() {
        super();
        const templates = document.getElementById('templates');
        this.templates = templates.cloneNode(true);
        templates.parentNode.removeChild(templates);
        this.beforeMount();
    }

    beforeMount() {
        const searchTemplate = this.getEntityTemplate('itemSearch');
        dates.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            return 0;
        });
        this.createCalendar();
    }

    createCalendar() {
        const month = 10;
        const year = 2019;

        const {days, startDate} = this.getCalendarOptions(month, year);
        const notes = this.getNotesByMonth(month, year);

        const dayTemplate = this.getEntityTemplate('calendarDay');

        const container = document.querySelector(`[data-id='calendar']`);
        container.innerHTML = '';

        let week;
        let weekIndex = 0;
        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
            if (i % 7 === 0) {
                weekIndex++;
                week && container.appendChild(week);
                week = document.createElement('div');
                week.classList.add('calendar__week');
            }
            const note = notes.find(({date: d}) => daysEqual(new Date(d * 1000), date));

            let filledTemplate = Renderer.getFilledTemplate(dayTemplate, {
                date: (weekIndex === 1 && getWeekDayName(date) + ', ') + date.getDate(),
                title: note && note.title || '',
                member: note && note.member || '',
                desc: note && note.desc || '',
            });
            if (note) {
                const c = 'calendar__day';
                filledTemplate = filledTemplate.replace(c, `${c} ${c}-active`);
            }
            week.innerHTML += filledTemplate;
        }
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
     *
     * @param {string} entity - data-entity attribute of the template
     * @return {HTMLElement}
     */
    getEntityTemplate(entity) {
        return this.templates.querySelector(`[data-entity=${entity}]`);
    }

    /**
     * @param {number} month
     * @param {number} year
     * @return {calendarDay[]}
     */
    getNotesByMonth(month, year) {
        const notes = [];
        dates.forEach((day) => {
            const date = new Date(day.date * 1000);
            if (month === date.getMonth() && year === date.getFullYear()) {
                notes.push(day);
            }
        });
        return notes;
    }
}

new NodeGenerator();
