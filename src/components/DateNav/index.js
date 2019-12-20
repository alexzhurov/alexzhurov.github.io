import { Control }      from '../../modules/Control';
import Store            from "../../modules/Store";
import { getMonthName } from '../../modules/utils/getMonthName';
import EventBus         from "../../modules/EventBus";

/**
 * @property {Object} state - state of the component
 * @property {Date} state.date - Выбранная дата
 */
export class DateNav extends Control {
    constructor(o) {
        super(o);
        this.state = {
            date: (new Date(Store.state.selectedDate))
        };
        this.bus = EventBus;
        this.nav = this.nav.bind(this);
        this.createEl();
    }

    nav(e) {
        e.stopPropagation();
        const {nav} = e.target.dataset;

        let date = (() => {
            const d = new Date(this.state.date);
            switch (nav) {
                case 'today':
                    return (new Date).setDate(1);
                case 'prev':
                    return d.setMonth(d.getMonth() - 1);
                case 'next':
                    return d.setMonth(d.getMonth() + 1);
            }
        })();
        date = new Date(date);
        this.state.date = date;
        Store.actions.setDate(date);
        this._forceUpdate();
    }

    render() {
        const dateText = () => {
            const d = this.state.date;
            const month = getMonthName(d);
            return `${month} ${d.getFullYear()}`;
        };
        return (`
            <nav class="navigation">
                <button onclick="nav" data-nav="prev" class="navigation__prev"></button>
                <div class="navigation__date">${dateText()}</div>
                <button onclick="nav" data-nav="next" class="navigation__next"></button>
                <div onclick="nav" data-nav="today" class="navigation__today">Сегодня</div>
            </nav>
`);
    }
}

