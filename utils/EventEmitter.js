export default class {
    #events = new Map();

    on(event, func = function() {}) {
        if (event === void 0 || typeof event !== "string") {
            throw new Error("INVALID_EVENT");
        }

        this.#events.set(event, func.bind(this));

        return this;
    }

    emit(event, ...args) {
        if (event === void 0 || typeof event !== "string") {
            return new Error("INVALID_EVENT");
        }

        event = this.#events.get(event);
        if (event === void 0 || typeof event !== "function") {
            return;
        }

        if (!event && typeof event !== "function") {
            return new Error("INVALID_FUNCTION");
        }

        return event(...args);
    }
}