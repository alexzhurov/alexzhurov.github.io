import './style/index.styl';
import Spider from './modules/Spider';
import Renderer from './modules/Renderer';
import { getWeekDayName } from './modules/Utils/getWeekDayName';
import { daysEqual } from './modules/Utils/daysEqual';
import { truncateText } from './modules/Utils/truncateText';
import { getNotesByMonth } from './modules/Calendart/getNotesByMonth';


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
 * @property {Node} calendar - element of the calendar container
 */
export class App extends Spider {
    constructor() {
        super();
        const templates = document.getElementById('templates');
        this.templates = templates.cloneNode(true);
        templates.parentNode.removeChild(templates);
        this.calendar = document.querySelector(`[data-id='calendar']`);
        this.beforeMount();
    }

    beforeMount() {
        this.createCalendar();
        this.bindEvents();
    }

    createCalendar() {
        const month = 10;
        const year = 2019;

        const {days, startDate} = this.getCalendarOptions(month, year);
        const notes = getNotesByMonth(month, year);

        const dayTemplate = this.getEntityTemplate('calendarDay');
        this.calendar.innerHTML = '';

        let week;
        let weekIndex = 0;
        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
            if (i % 7 === 0) {
                weekIndex++;
                week && this.calendar.appendChild(week);
                week = document.createElement('div');
                week.classList.add('calendar__week');
            }
            const note = notes.find(({date: d}) => daysEqual(new Date(d * 1000), date));

            let filledTemplate = Renderer.getFilledTemplate(dayTemplate, {
                date: (weekIndex === 1 && getWeekDayName(date) + ', ') + date.getDate(),
                title: note && truncateText(note.title, 30) || '',
                member: note && truncateText(note.member, 45) || '',
                // desc: note && note.desc || '',
            });
            if (note) {
                const c = 'calendar__day';
                filledTemplate = filledTemplate.replace(c, `${c} ${c}-active`);
            }
            week.innerHTML += filledTemplate;
        }
    }

    bindEvents(){
        this.calendar.addEventListener('click', (Event) => {
            console.log(Event.target.closest('[data-entity="calendarDay"]'))
        });
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
}

