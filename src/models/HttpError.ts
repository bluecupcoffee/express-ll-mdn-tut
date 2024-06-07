class HttpError extends Error {
    status: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.name = "HttpError";
        this.status = statusCode;
    }
}

export default HttpError;