import { Control }              from '../../modules/Control';
import Store                    from "../../modules/Store";
import { getMonthName }         from '../../modules/utils/getMonthName';
import EventBus                 from "../../modules/EventBus";
import { CALENDAR_DATE_CHANGE } from "../../modules/Constants/Events";

/**
 * @property {Object} state - state of the component
 */
export class DateNav extends Control {
    constructor(o) {
        super(o);
        this.state = {};
        this.bus = EventBus;
        this.nav = this.nav.bind(this);
        this._forceUpdate = this._forceUpdate.bind(this);
        this.bus.subscribe(CALENDAR_DATE_CHANGE, this._forceUpdate);
        this.createEl();
    }

    nav(e) {
        e.stopPropagation();
        const {nav} = e.target.dataset;

        const date = (() => {
            const d = new Date(Store.state.selectedDate);
            switch (nav) {
                case 'today':
                    return (new Date).setDate(1);
                case 'prev':
                    return d.setMonth(d.getMonth() - 1);
                case 'next':
                    return d.setMonth(d.getMonth() + 1);
            }
        })();
        Store.actions.setDate(date);
    }

    render() {
        const dateText = () => {
            const d = new Date(Store.state.selectedDate);
            const month = getMonthName(d);
            return `${month} ${d.getFullYear()}`;
        };
        return (`
            <nav class="navigation">
                <button onclick="nav" tabindex="1" data-nav="prev" class="navigation__prev"></button>
                <div class="navigation__date">${dateText()}</div>
                <button onclick="nav" tabindex="1" data-nav="next" class="navigation__next"></button>
                <div onclick="nav" tabindex="1" data-nav="today" class="navigation__today">Сегодня</div>
            </nav>
`);
    }
}

