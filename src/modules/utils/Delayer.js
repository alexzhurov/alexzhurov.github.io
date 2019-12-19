export default new class Delayer {
    constructor() {
        this.stack = {}
    }

    addStack(fn, delay) {
        let code = this.getHashCode(fn.toString());
        if (!this.stack[code]) {
            this.stack[code] = fn;
            setTimeout(() => {
                this.stack[code]();
                delete this.stack[code]
            }, delay);
        }
    }

    /**
     * Reterns positive hashcode from string
     * @param {string} s
     * @return {number}
     */
    getHashCode(s) {
        return s.split("").reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            const res = a & a;
            return Math.abs(res)
        }, 0)
    }
}

