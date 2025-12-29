export class CustomPLError<T = any> {
  error: T;
  constructor(error: T) {
    this.error = error;
    console.error(error);
  }
}
