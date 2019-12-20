export default new class EventBus {
    /**
     * Initialize a new event bus instance.
     */
    constructor() {
        this.bus = document.createElement('event-bus-singleton');
    }

    /**
     * Add an event listener.
     */
    subscribe(event, callback) {
        this.bus.addEventListener(event, callback);
    }

    /**
     * Remove an event listener.
     */
    unsubscribe(event, callback) {
        this.bus.removeEventListener(event, callback);
    }

    /**
     * Dispatch an event.
     */
    notify(event, detail = {}) {
        this.bus.dispatchEvent(new CustomEvent(event, {detail}));
    }
}
