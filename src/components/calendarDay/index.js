/**
 * @param {Object} data - An object.
 * @param {Date} data.key
 * @param {boolean} data.isActive - Has Active note in the day.
 * @param {string} data.date
 * @param {string} data.title
 * @param {string} data.member
 * @return {string}
 */
export const calendarDayFC =
    ({
         key = null,
         isActive = false,
         date = '',
         title = '',
         member = ''
     }) => {
        !key && console.warn(`В компонент calendarDayFC - не передан key=${key}`);
        const keyNum = Number(key) / 1000;
        return (`
<div class="calendar__day ${(isActive ? 'calendar__day-active' : '')} day-item"
data-exist="${isActive}"
data-key="${keyNum}" onclick="onClick">
<div class="day-item__date">${date}</div>
${isActive ? `
    <div class="day-item__title">${title}</div>
    <div class="day-item__member">${member}</div>` : ' '
        }
</div>`);
    };

