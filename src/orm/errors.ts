import { VollieError } from "../errors";

export class VollieDatabaseError extends VollieError {
    constructor(message: string, cause?: Error) {
        super(message, cause);
    }
}