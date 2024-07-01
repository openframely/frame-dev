// frame/camera.d.ts

/** @noSelf */
declare module "camera" {

  /**
   * Captures a single image from the camera.
   * @param options - Optional parameters to adjust the JPEG quality factor.
   * quality_factor must be either 100, 50, 25 or 10
   */
  function capture(options?: { quality_factor?: number }): void;

  /**
   * Reads out a number of bytes from the camera capture memory as a byte string.
   * @param num_bytes - The number of bytes to read.
   * @returns A byte string or nil when all bytes have been read.
   */
  function read(num_bytes: number): string | null;

  /**
   * Runs the automatic exposure and gain algorithm.
   * @param options - Optional parameters to configure the metering, exposure, shutter, gain, and gain limit.
   */
  function auto(options?: {
    metering?: string,
    exposure?: number,
    shutter_kp?: number,
    gain_kp?: number,
    gain_limit?: number
  }): void;

  /**
   * Puts the camera to sleep and reduces power consumption.
   */
  function sleep(): void;

  /**
   * Wakes up the camera if it has previously been asleep.
   */
  function wake(): void;

  /**
   * Sets the shutter value manually.
   * @param shutter - The shutter value.
   * shutter must be between 4 and 16383
   */
  function set_shutter(shutter: number): void;

  /**
   * Sets the gain value manually.
   * @param gain - The gain value.
   * gain must be between 0 and 248
   */
  function set_gain(gain: number): void;

  /**
   * Sets the digital gains of the R, G, and B channels for fine-tuning white balance.
   * @param r - The red channel gain.
   * @param g - The green channel gain.
   * @param b - The blue channel gain.
   * r, g, and b must be between 0 and 255
   */
  function set_white_balance(r: number, g: number, b: number): void;

  /**
   * Allows for hacking the camera’s internal registers.
   * @param address - The register address.
   * @param value - The value to write to the register.
   * address must be a 16 bit unsigned number
   * value must be an 8 bit unsigned number
   */
  function set_register(address: number, value: number): void;

}