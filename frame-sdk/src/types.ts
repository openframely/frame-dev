class Ref<T> {
  constructor(public value: T) {}

  static of<T>(value: T): Ref<T> {
    return new Ref(value);
  }
}
