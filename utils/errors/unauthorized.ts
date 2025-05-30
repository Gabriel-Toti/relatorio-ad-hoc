export class Unauthorized extends Error {
  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "Unauthorized";
  }
}
