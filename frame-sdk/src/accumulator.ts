import { Readable } from "node:stream";

export class Accumulator extends Readable {
  data: Uint8Array[] = [];
  expected = 0;

  constructor() {
    super({ objectMode: true });
  }

  _read(size: number) {
    console.log("Reading data for accumulator...expected: ", this.expected);
    this.push(this.data.shift());
  }

  accumulate(data: Uint8Array): void {
    if (this.expected >= 0) {
      console.log("Pushing data for accumulator...expected: ", this.expected--);
      this.data.push(data);
    }
  }

  expect(size: number): void {
    this.expected = size;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  read(size?: number): any {
    return this.expected === 0 ? 0 : super.read(size);
  }
}
