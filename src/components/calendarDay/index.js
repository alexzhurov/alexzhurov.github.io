/**
 * @param {boolean} isActive
 * @param {string} date
 * @param {string} title
 * @param {string} member
 * @return {string}
 */
export const calendarDayFC = (isActive = false, date, title, member) => {
    return (`
<div class="calendar__day day-item"
     data-entity="calendarDay">
    <div class="day-item__date">${date}</div>` +
        (isActive ? `<div class="day-item__title">${title}/div>
    <div class="day-item__member"> ${member}/div>` : '') +
        `</div>`
    )
};



