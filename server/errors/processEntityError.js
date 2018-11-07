export default class ProcessEntityError extends Error {
    constructor(message) {
        super(message);
        this.name = "ProcessEntityError";
    }
}