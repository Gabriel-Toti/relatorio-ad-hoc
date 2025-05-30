export class NotDefined extends Error {
  constructor(message = "Required value not defined") {
    super(message);
    this.name = "NotDefined";
  }
}
