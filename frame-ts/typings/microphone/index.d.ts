// frame/microphone.d.ts

/** @noSelf */
declare module "microphone" {

  /**
   * Starts streaming mic data into the internal 32k buffer.
   * @param options - Optional parameters to configure the sample rate and bit depth.
   * sample rate must be 8000 or 16000
   * bit depth must be 8 or 16
   */
  function start(options?: { sample_rate?: number, bit_depth?: number }): void;

  /**
   * Stops the stream.
   */
  function stop(): void;

  /**
   * Reads out a number of bytes from the buffer.
   * @param num_bytes - The number of bytes to read. num_bytes must be a multiple of 2
   * @returns A byte string, an empty string if streaming is active, or nil if streaming is stopped.
   */
  function read(num_bytes: number): string | null;

}