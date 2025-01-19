import { StatusCodes } from "http-status-codes";

export const codes = [
    "BAD_REQUEST",
    "UNKNOWN",
    "REQUEST_FAILED",
    "CMS_REJECTED",
    "ACCOUNT_CREATION_FAILED",
    "ACCOUNT_BLOCKED",
] as const;
export type Code = (typeof codes)[number];

export const messages: { [key in Code]: string } = {
    BAD_REQUEST: "The request was invalid.",
    UNKNOWN: "An unknown error occurred.",
    REQUEST_FAILED: "The request to the CMS failed.",
    CMS_REJECTED: "The CMS rejected the request.",
    ACCOUNT_CREATION_FAILED: "Account creation failed.",
    ACCOUNT_BLOCKED: "Account is blocked."
};

export const statusCodes: { [key in Code]: StatusCodes } = {
    BAD_REQUEST: StatusCodes.BAD_REQUEST,
    UNKNOWN: StatusCodes.INTERNAL_SERVER_ERROR,
    REQUEST_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
    CMS_REJECTED: StatusCodes.FORBIDDEN,
    ACCOUNT_CREATION_FAILED: StatusCodes.INTERNAL_SERVER_ERROR,
    ACCOUNT_BLOCKED: StatusCodes.FORBIDDEN
};

export interface JSONRequestError {
    code: Code;
    message: string;
    full: unknown | undefined;
}

export default class RequestError extends Error {
    constructor(
        public code: Code,
        public full?: unknown,
        public status: StatusCodes = statusCodes[code],
        public message: string = messages[code]
    ) {
        super(message);
        this.name = "RequestError";
    }

    json(): [JSONRequestError, StatusCodes] {
        return [{
            code: this.code,
            message: this.message,
            full: this.full,
        }, this.status];
    }
}