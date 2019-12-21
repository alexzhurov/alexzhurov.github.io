import Delayer from './Delayer';


/**
 * выполнить переданную функция с задежкой
 * @param {function<T>} callback - Функция
 * @param {number} delay  - Задержка в ms
 * @return {function<T>|void}
 *
 */
export function delayFn(callback, delay) {
    Delayer.addStack(callback, delay);
}
