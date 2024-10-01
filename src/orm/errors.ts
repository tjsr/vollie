import { VollieError } from "../types";

export class VollieDatabaseError extends VollieError {
    constructor(message: string, cause?: Error) {
        super(message, cause);
    }
}