/**
 * Get html elements from string
 * @param {string} str - html element as a string
 * @return {HTMLElement}
 */
export const getNodeByString = (str) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = str;
    return tmp.firstElementChild;
};
