/**
 * @param {string} title
 * @param {string} date
 * @return {string}
 */
export const itemSearchFC = (title, date) => {
    return (`
<div class="item-search" 
     data-entity="itemSearch">
    <div class="item-search__title">${title}</div>
    <div class="item-search__date">${date}</div>
</div>`
    )
};
