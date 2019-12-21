import { Control }        from '../../modules/Control';
import { getMonthNumber } from '../../modules/utils/getMonthNumber';
import EventBus           from '../../modules/EventBus';
import Store              from '../../modules/Store';


export class FastEvent extends Control {
    constructor(o) {
        super(o);
        this.state = {
            message: '',
            date: null
        };
        this.bus = EventBus;

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.input = this.input.bind(this);
        this.keydown = this.keydown.bind(this);
        this.createEl();
    }

    /**
     * @param {Event} e
     */
    create(e) {
        e && e.stopPropagation();
        const note = this.decodeMessage();
        Store.actions.saveNote(note);
    }

    /**
     * @return {calendarDayParsed}
     */
    decodeMessage() {
        const defaultYear = new Date(Store.state.selectedDate).getFullYear();


        let [fullDate, desc, ...msg] = this.state.message.split(',').map((s) => s.trim());
        const title = msg.join(', ').trim();
        let [date, month, year = defaultYear] = fullDate
            .trim()
            .split(' ')
            .map((s, i) => i === 1 ? getMonthNumber(s) : Number(s));
        year = ((year) => {
            switch (true) {
                case year < 50:
                    return year += 2000;
                case year < 100:
                    return year += 1900;
                default:
                    return year
            }
        })(year);

        return {
            date: new Date(year, month, date),
            desc,
            title,
            member: ''
        };
    }

    /**
     * @param {Event} e
     */
    close(e = null) {
        e && e.stopPropagation();

        this.el.remove();
    }

    /**
     *
     * @param{InputEvent} e
     */
    input(e) {
        e && e.stopPropagation();

        this.state = {
            ...this.state,
            message: e.target.value
        };
    }

    /**
     *
     * @param{KeyboardEvent} e
     */
    keydown(e) {
        if (e.key === 'Enter') {
            e.stopPropagation();
            this.close();
        }
    }

    render() {
        return (`
<div class="fastEvent">
    <input type="text" class="input fastEvent__input"
           placeholder="15 марта, 14:00, День рождения"
           oninput="input"
           onkeypress="keydown"
           value="${this.state && this.state.message}"
           >
    <button onclick="create" class="btn-sm fastEvent__submit">Создать</button>
    <div onclick="close" class="modalClose">&times;</div>
</div>
`);
    }
}

