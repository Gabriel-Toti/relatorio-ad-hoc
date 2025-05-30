export class Forbidden extends Error {
  constructor(message = "Forbidden access") {
    super(message);
    this.name = "Forbidden";
  }
}
