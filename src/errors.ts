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

export class UserNotFoundError extends VollieError {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
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
