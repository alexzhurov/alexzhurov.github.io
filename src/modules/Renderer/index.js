export default class Renderer {

    /**
     * Get html element as a string
     * @param {HTMLElement} node - root template element
     * @return {string}
     */
    static getNodeString(node) {
        const tmp = document.createElement('div');
        tmp.appendChild(node);
        return tmp.innerHTML.trim();
    }

    /**
     * Creates a node with provided data
     * @param {HTMLElement} template - root template element
     * @param {Object} data - object with info
     * @return {string}
     */
    static getFilledTemplate(template, data) {
        let nodeString = this.getNodeString(template);
        let rxp = /{{([^}]+)}}/g; // regex {{ variable }}
        let curMatch;

        while ((curMatch = rxp.exec(nodeString)) !== null) {
            const target = curMatch[0];
            const dataVar = curMatch[1].trim();
            const state = data[dataVar];
            if (state || state === '') {
                nodeString = nodeString.replace(target, state);
            } else {
                console.warn(dataVar, 'variable wasn\'t provided in ', data)
            }
        }
        return nodeString;
    }
}




