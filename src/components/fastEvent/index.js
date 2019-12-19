import { Control }        from '../../modules/Control';
import { getMonthNumber } from '../../modules/utils/getMonthNumber';

export class FastEvent extends Control {
    constructor(o) {
        super(o);
        this.state = {
            message: '',
            date: null
        };

        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
        this.input = this.input.bind(this);
        this.createEl();
    }

    /**
     * @param {Event} e
     */
    create(e) {
        e.preventDefault();
    }

    decodeMessage() {
        let [fullDate, time, ...message] = this.state.message.split(',');
        time = time.trim();
        message = message.join(',').trim();
        fullDate = fullDate.trim();

        let [date, month, year = (new Date()).getFullYear()] = fullDate.split(' ');
        year = Number(year);
        date = Number(date);
        month = getMonthNumber(month);
        year = year > 100 ? year : year + 2000;
        console.log(message, '=', new Date(year, month, date));
    }

    /**
     * @param {Event} e
     */
    close(e) {
        e.preventDefault();

        this.el.remove();
    }

    /**
     *
     * @param{InputEvent} e
     */
    input(e) {
        e.preventDefault();

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
            e.preventDefault();
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
    <div onclick="close" class="close">&times;</div>
</div>
`);
    }
}

