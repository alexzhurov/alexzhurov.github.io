const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота',];

/**
 * Get name of week day.
 * @param {Date} date
 * return {string}
 */
export function getWeekDayName(date) {
    if (date instanceof Date) {
        return days[date.getDay()];
    } else {
        throw new Error('Wrong Date argument')
    }
}
