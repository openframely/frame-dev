/**
 * The Microphone class allows for streaming audio to a host device in real-time.
 * Transfers are limited by the Bluetooth bandwidth which is typically around 40kBps under good signal conditions.
 * The audio bitrate for a given sample rate and bit depth is: sample_rate * bit_depth / 8 bytes per second.
 * An internal 32k buffer automatically compensates for additional tasks that might otherwise briefly block Bluetooth transfers.
 * If this buffer limit is exceeded, then discontinuities in audio might occur.
 */
export class Microphone {
  private bitDepth: 8 | 16;
  private buffer: Uint8Array;
  private sampleRate: 8000 | 16000;
  private streaming: boolean;

  constructor() {
    this.buffer = new Uint8Array(32768);
    this.streaming = false;
    this.sampleRate = 8000;
    this.bitDepth = 8;
  }

  /**
   * Reads out a number of bytes from the buffer.
   * If all bytes have been read but streaming is still active, an empty string will be returned.
   * Once the stream has been stopped and all bytes have been read, then null will be returned.
   * @param numBytes - The number of bytes to read from the buffer.
   * @returns The read bytes as a string, or null if the stream has been stopped and all bytes have been read.
   */
  read(numBytes: number): string | null {
    if (numBytes > this.buffer.length) {
      numBytes = this.buffer.length;
    }
    if (!this.streaming && this.buffer.length === 0) {
      return null;
    }

    const readBytes = this.buffer.slice(0, numBytes);
    this.buffer = this.buffer.slice(numBytes); // Remove the read bytes from the buffer

    if (readBytes.length === 0 && this.streaming) {
      return "";
    }

    return new TextDecoder().decode(readBytes);
  }

  /**
   * Starts streaming mic data into the internal 32k buffer.
   * @param sampleRate - The sample rate of the audio. Can be either 8000 or 16000.
   * @param bitDepth - The bit depth of the audio. Can be either 8 or 16.
   */
  start(sampleRate: 8000 | 16000, bitDepth: 8 | 16): void {
    this.sampleRate = sampleRate;
    this.bitDepth = bitDepth;
    this.streaming = true;
    // Initialize the buffer and start streaming audio data
    console.log(`Microphone started with sample rate: ${sampleRate} Hz, bit depth: ${bitDepth} bits`);
  }

  /**
   * Stops the streaming of mic data.
   */
  stop(): void {
    this.streaming = false;
    // Stop streaming audio data
    console.log("Microphone stopped");
  }
}
