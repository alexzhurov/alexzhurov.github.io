/**
 * @type {calendarDay[]}
 */
import dates from "../../mock";

/**
 * @param {number} month
 * @param {number} year
 * @return {calendarDay[]}
 */
export function getNotesByMonth(month, year) {
    dates.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
    });
    const notes = [];
    dates.forEach((day) => {
        const date = new Date(day.date * 1000);
        if (month === date.getMonth() && year === date.getFullYear()) {
            notes.push(day);
        }
    });
    return notes;
}
