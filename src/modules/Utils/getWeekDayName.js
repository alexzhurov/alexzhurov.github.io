const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота',];
/**
 *
 * @param {Date} date
 * return {string}
 */
export function getWeekDayName(date) {
    return days[date.getDay()];
}
