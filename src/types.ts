export interface Env {
  // If you set another name in wrangler.toml as the value for 'binding',
  // replace "DB" with the variable name you defined.
  VOLLIE_DB: D1Database;
}


export class VollieError extends Error {
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

export type { VollieDrizzleConnection } from './orm/types.js';