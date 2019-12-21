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
        this.onSearch = this.onSearch.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onInputClick = this.onInputClick.bind(this);
        this.createEl();
    }

    /**
     * @param{KeyboardEvent} e
     */
    keydown(e) {
        if (e.key === 'Enter') {
            e.stopPropagation();
            // this.state.isActive = false;
            this._forceUpdate();
        }
    }

    /**
     * @param {InputEvent} e
     */
    onSearch(e) {
        e.stopPropagation();
        this.state = {
            ...this.state,
            searchStr: e.target.value
        };
        delayFn(() => {
            this.state.isActive = this.state.searchStr !== '';
            this.renderSearch();
        }, 800)
    }

    onInputClick(e) {
        // debugger;
        if (this.state.searchStr !== '') {
            this.state.isActive = true;
            this.renderSearch();
        }
    }

    onClick(e) {
        e.stopPropagation();
        const item = e.target.closest('[data-date]');
        const selectedDate = new Date(Number(item.dataset.date) * 1000);
        Store.actions.setDate(selectedDate);
        this.state.isActive = false;
        this._forceUpdate();
    }

    renderSearch() {
        Store.actions.getNotesByString(this.state.searchStr);
        // const notes = Store.state.searchedNotes;

        // this.state.isActive = notes.length > 0;
        this._forceUpdate();
        this.focusSearch();
    }

    focusSearch() {
        const el = this.el.querySelector('input[type="text"]');
        el.focus();
        el.selectionStart = el.selectionEnd = 10000;
    }


    render() {
        const list = Store.state.searchedNotes.map(({title, date}) => {
            let d = new Date(date * 1000);
            const m = getMonthName(d);
            return `<div class="search__item item-search"
                        tabindex="10"
                        onclick="onClick" data-date="${date}">
                        <div class="item-search__title">${title}</div>
                        <div class="item-search__date">${d.getDate()} ${m}</div>
                    </div>`
        }).join('');
        const emptyList = `<div class="search__item item-search">
                        <div class="item-search__title">Совпадений не найдеено</div>
                    </div>`;

        return (`
<div class="header__search">
    <label class="search">
        <span class="search__icon">${searchIcon}</span>
        <input class="input" 
            type="text" 
            onclick="onInputClick"
            oninput="onSearch"
            onkeypress="keydown"
            value="${this.state && this.state.searchStr}"
            placeholder="Событие, дата или участник"
        >
    </label>
    <div class="search__container ${this.state && this.state.isActive ? 'search__container-active' : ''}">
        <div class="search__list">
        ${Store.state.searchedNotes.length ? list : emptyList}
        </div>
    </div>
</div>
`);
    }
}

