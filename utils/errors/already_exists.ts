export class AlreadyExists extends Error {
  constructor(message = "Value already exists") {
    super(message);
    this.name = "AlreadyExists";
  }
}
