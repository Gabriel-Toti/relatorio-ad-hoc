export class ValidationError extends Error {
  constructor(message: string = "Validation Error") {
    super(message);
    this.name = "ValidationError";
  }
}
