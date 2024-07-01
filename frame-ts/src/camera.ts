/**
 * The Camera class allows for capturing and downloading of single JPEG images over Bluetooth.
 * The sensor’s full resolution is 1280x720 pixels in portrait orientation, however only square images up to 720x720 pixels can be captured at a time.
 * The user can select which portion of the sensor’s window is captured using the pan control.
 * Additionally, the resolution of the capture can be cropped to either 360x360, 240x240, or 180x180 by using the zoom function.
 * Smaller resolutions will increase the image quality, however the quality factor can be reduced to decrease the image file size and increase download speeds of the image over Bluetooth.
 */
export class Camera {
  private buffer: Uint8Array;
  private streaming: boolean;

  constructor() {
    this.buffer = new Uint8Array(32768);
    this.streaming = false;
  }

  /**
   * Captures a single image from the camera.
   * @param qualityFactor - The quality factor of the JPEG image. Can be 10, 25, 50, or 100.
   */
  capture(qualityFactor: 10 | 25 | 50 | 100): void {
    // Capture an image with the specified quality factor
    console.log(`Camera captured an image with quality factor: ${qualityFactor}`);
  }

  /**
   * Reads out a number of bytes from the camera capture memory as a byte string.
   * Once all bytes have been read, null will be returned.
   * @param numBytes - The number of bytes to read from the buffer.
   * @returns The read bytes as a string, or null if all bytes have been read.
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
   * Runs the automatic exposure and gain algorithm.
   * This function must be called every 100ms for the best performance.
   * @param metering - The metering mode. Can be 'SPOT', 'CENTER_WEIGHTED', or 'AVERAGE'.
   * @param exposure - The exposure value. Can be between -2.0 and 2.0.
   * @param shutterKp - The shutter proportional gain. Higher values can make reaching the desired exposure faster.
   * @param gainKp - The gain proportional gain. Higher values can make reaching the desired exposure faster.
   * @param gainLimit - The maximum gain limit. Can be used to reduce noise in darker scenes.
   */
  auto(
    metering: "SPOT" | "CENTER_WEIGHTED" | "AVERAGE",
    exposure: number,
    shutterKp: number,
    gainKp: number,
    gainLimit: number
  ): void {
    console.log(`Auto exposure and gain set with metering: ${metering}, exposure: ${exposure}, shutterKp: ${shutterKp}, gainKp: ${gainKp}, gainLimit: ${gainLimit}`);
  }

  /**
   * Puts the camera to sleep and reduces power consumption.
   */
  sleep(): void {
    console.log("Camera put to sleep");
  }

  /**
   * Wakes up the camera if it has previously been asleep.
   */
  wake(): void {
    console.log("Camera woke up");
  }

  /**
   * Sets the shutter value manually.
   * @param shutter - The shutter value. Can be between 4 and 16383.
   */
  setExposure(shutter: number): void {
    console.log(`Camera shutter value set to: ${shutter}`);
  }

  /**
   * Sets the gain value manually.
   * @param gain - The gain value. Can be between 0 and 248.
   */
  setGain(gain: number): void {
    console.log(`Camera gain value set to: ${gain}`);
  }

  /**
   * Sets the digital gains of the R, G, and B channels for fine-tuning white balance.
   * @param r - The red channel gain. Can be between 0 and 1023.
   * @param g - The green channel gain. Can be between 0 and 1023.
   * @param b - The blue channel gain. Can be between 0 and 1023.
   */
  setWhiteBalance(r: number, g: number, b: number): void {
    console.log(`Camera white balance set to R: ${r}, G: ${g}, B: ${b}`);
  }

  /**
   * Allows for hacking the camera’s internal registers.
   * @param address - The 16-bit register address of the camera.
   * @param value - The 8-bit value to write to the register.
   */
  setRegister(address: number, value: number): void {
    console.log(`Camera register at address ${address} set to value: ${value}`);
  }
}
