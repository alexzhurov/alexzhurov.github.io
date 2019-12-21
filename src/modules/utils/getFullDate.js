/**
 * @param {string} str - string like 'd.m.YY'|'d,m,YY'
 * @return {Date} Date
 */
export const getFullDate = (str) => {
    let [day, month, fullYear] = str.split(/[.,]+/).map((s) => Number(s));
    return new Date(fullYear, month - 1, day);
};

