export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "DB" with the variable name you defined.
  VOLLIE_DB: D1Database;
}


export class VollieError extends Error {
  status: number = 500;

  constructor(message: string, cause?: Error) {
      super(message, cause);
      this.name = this.constructor.name;
  }
}

export class NotFoundError extends VollieError {
  constructor(message: string, cause?: Error) {
      super(message, cause);
      this.name = this.constructor.name;
  }
}

export class BadRequestError extends VollieError {
  constructor(message: string, cause?: Error) {
      super(message, cause);
      this.name = this.constructor.name;
  }
}

export class InvalidContentError extends VollieError {
  constructor(message: string, cause?: Error) {
      super(message, cause);
      this.name = this.constructor.name;
  }
}

export class InvalidContentTypeError extends InvalidContentError {
  constructor(received: string, url: string, expected: string | undefined, cause?: Error) {
    super(
      `Invalid content type while fetching ${url}, got ${received}${expected !== undefined ? ' but expected ' + expected : ''}`,
      cause);
      this.name = this.constructor.name;
  }
}

export type { VollieDrizzleConnection } from './orm/types.js';