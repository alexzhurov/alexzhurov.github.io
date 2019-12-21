import { Control }                                 from '../../modules/Control';
import Store                                       from "../../modules/Store";
import { CALENDAR_DATE_CHANGE, CALENDAR_DAY_OPEN } from "../../modules/Constants/Events";
import { getWeekDayName }                          from "../../modules/utils/getWeekDayName";
import { truncateText }                            from "../../modules/utils/truncateText";
import { freshStr }                                from "../../modules/utils/freshStr";
import EventBus                                    from '../../modules/EventBus';
import { calendarDayFC }                           from "../calendarDay";

export class Calendar extends Control {
    constructor(o) {
        super(o);
        /**
         * @typedef state
         * @param {number} calendarWeeks - Количество недель в листе календаря
         * @param {Date} startDate - дата от которой начинается лист календаря
         * @param {Array} scheme - временные данные для шаблона
         */
        this.state = {
            calendarWeeks: 0,
            startDate: null,
            scheme: []
        };
        this.createEl();
        this.setBinds();
        this.calendarDateChangeHandler();
    }

    setBinds() {
        this.onClick = this.onClick.bind(this);
        this.calendarDateChangeHandler = this.calendarDateChangeHandler.bind(this);
        this.bus = EventBus;
        this.bus.subscribe(CALENDAR_DATE_CHANGE, this.calendarDateChangeHandler);
    }


    /**
     * @param {number} month
     * @param {number} fullYear
     */
    getCalendarOptions(month, fullYear) {
        const maxDays = new Date(fullYear, month + 1, 0).getDate();
        const firstDay = new Date(fullYear, month, 1);
        const firstWeekDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
        const preDays = firstWeekDay - 1;
        const weeks = Math.ceil((maxDays + preDays) / 7);

        const startDate = new Date(firstDay.getTime());
        startDate.setDate(startDate.getDate() - preDays);

        this.state.calendarWeeks = weeks;
        this.state.startDate = new Date(startDate.getTime())
    }

    getCalendarScheme() {
        const {startDate, calendarWeeks} = this.state;
        let result = [];
        for (let w = 0; w <= calendarWeeks; w++) {
            result.push([]);
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + w * 7 + day);
                const note = Store.actions.getNoteByDate(date);

                result[w][day] = {
                    key: date,
                    isActive: !!note,
                    date: (w === 0 && getWeekDayName(date) + ', ') + date.getDate(),
                    title: note && truncateText(freshStr(note.title), 30) || '',
                    member: note && truncateText(freshStr(note.member), 45) || ''
                };
            }
        }
        this.state.scheme = result;
    }

    createCalendar(
        month = (new Date).getMonth(),
        fullYear = (new Date).getFullYear()
    ) {
        Store.actions.getNotesByMonth(month, fullYear);
        this.getCalendarOptions(month, fullYear);
        this.getCalendarScheme();
        this._forceUpdate();
    }

    calendarDateChangeHandler() {
        const d = new Date(Store.state.selectedDate);
        this.createCalendar(d.getMonth(), d.getFullYear());
    }

    /**
     * @param {MouseEvent} e
     */
    onClick(e) {
        e.stopPropagation();
        const el = e.target.closest('[data-key]');
        this.bus.notify(CALENDAR_DAY_OPEN, {el, key: el.dataset.key});
    }

    render() {
        return (
            `<div class="calendar">
            ${this.state.scheme.map((week) => (`
<div class="calendar__week">
${week.map((day) => calendarDayFC(day)).join('')}
</div>
                `)).join('')
            }</div>`
        )
    }

}

