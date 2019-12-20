import { Control }      from '../../modules/Control';
import searchIcon       from './../../icons/search.svg';
import Store            from "../../modules/Store";
import { delayFn }      from '../../modules/utils/delayFn';
import { getMonthName } from '../../modules/utils/getMonthName';

/**
 * @property {Object} state - state of the component
 * @property {string} state.searchStr - строка поиска
 * @property {boolean} state.isActive
 */
export class SearchComponent extends Control {
    constructor(o) {
        super(o);
        this.state = {
            searchStr: '',
            isActive: false
        };

        this.keydown = this.keydown.bind(this);
        this.onsearch = this.onsearch.bind(this);
        this.click = this.click.bind(this);
        this.createEl();
    }

    /**
     *
     * @param{KeyboardEvent} e
     */
    keydown(e) {
        if (e.key === 'Enter') {
            e.stopPropagation();
            this.state.isActive = false;
            this._forceUpdate();
        }
    }

    /**
     * @param {InputEvent} e
     */
    onsearch(e) {
        e.stopPropagation();
        this.state = {
            ...this.state,
            searchStr: e.target.value
        };
        delayFn(() => {
            this.renderSearch();
        }, 800)
    }

    click(e) {
        e.stopPropagation();
        const item = e.target.closest('.search__item');
        const selectedDate = item.dataset.date;
    }

    renderSearch() {
        Store.actions.getNotesByString(this.state.searchStr);
        const notes = Store.state.searchedNotes;

        this.state.isActive = notes.length > 0;
        this._forceUpdate();
    }


    render() {
        const list = Store.state.searchedNotes.map(({title, date}) => {
            let d = new Date(date * 1000);
            const m = getMonthName(d);
            return `<div class="search__item item-search"
                        onclick="click" data-date="${date}">
                        <div class="item-search__title">${title}</div>
                        <div class="item-search__date">${d.getDate()} ${m}</div>
                    </div>`
        }).join('');
        const emptyList = `<div class="search__item item-search">
                        <div class="item-search__title">Совпадений не найдеено</div>
                    </div>`


        return (`
<div class="header__search">
    <label class="search">
        <span class="search__icon">${searchIcon}</span>
        <input class="input" 
            type="search" 
            oninput="onsearch"
            onkeypress="keydown"
            value="${this.state && this.state.searchStr}"
            placeholder="Событие, дата или участник"
        >
    </label>
    <div class="search__container ${this.state && this.state.isActive ? 'search__container-active' : ''}">
        <div class="search__list">
        ${this.state && this.state.isActive ? list : emptyList}
        </div>
    </div>
</div>
`);
    }
}

