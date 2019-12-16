/**
 * Compare two dates.
 * @param {Date} d1
 * @param {Date} d2
 * @return {boolean} boolean
 */
export function daysEqual(d1, d2) {
    const t1 = d1 && `${d1.getDate()}.${d1.getMonth()}.${d1.getFullYear()}`;
    const t2 = d2 && `${d2.getDate()}.${d2.getMonth()}.${d2.getFullYear()}`;
    return t1 === t2;
}
