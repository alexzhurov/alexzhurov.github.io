const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];

/**
 * Get name of month
 * @param {Date|number} date
 * return {string}
 */
export function getMonthName(date) {
    let d;
    switch (true) {
        case date instanceof Date:
            d = date;
            break;
        case typeof date === 'number':
            d = new Date(date);
            break;
        default:
            throw new Error('Wrong Date argument')
    }
    return months[d.getMonth()];
}
