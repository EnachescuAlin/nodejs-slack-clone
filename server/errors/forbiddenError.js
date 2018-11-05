export default class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
        Error.captureStackTrace(this, ForbiddenError);
    }
}