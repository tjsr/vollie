export class ValidationError extends Error {
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'ValidationError';
  }
}
