import Delayer from './Delayer';


/**
 * выполнить переданную функция с задежкой
 * @param {function<T>} callback - Функция
 * @param {number} delay  - Задержка в ms
 * @return {function<T>|void}
 *
 */
export function delayFn(callback, delay) {
    // console.log("delaFn.js => getMonthName => callback: ", callback);
    // console.log("delaFn.js => getMonthName => time: ", delay);
    /*
    глобальный обьект
    класс синглтон для каждого события
     */
    Delayer.addStack(callback, delay);
}
