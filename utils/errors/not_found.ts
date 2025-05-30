export class NotFound extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFound";
  }
}
