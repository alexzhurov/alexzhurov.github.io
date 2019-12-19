export default new class StorageManager {
    loadState() {
        try {
            const serializedState = localStorage.getItem('state');
            if (serializedState === null) {
                return undefined;
            }
            return JSON.parse(serializedState);
        } catch (err) {
            return undefined;
        }
    }

    saveState(state) {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem('state', serializedState);
        } catch {
            // ignore write errors
        }
    }
}


