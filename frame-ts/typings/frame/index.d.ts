// frame/system.d.ts

/** @noSelf */
declare module "frame" {

  /**
   * Returns the current firmware version as a 12 character string.
   * @returns The firmware version.
   */
  const FIRMWARE_VERSION: string;

  /**
   * Returns the current firmware git tag as a 7 character string.
   * @returns The firmware git tag.
   */
  const GIT_TAG: string;

  /**
   * Returns the battery level as a percentage between 1 and 100.
   * @returns The battery level.
   */
  function battery_level(): number;

  /**
   * Sleeps for a given number of seconds. If no argument is given, Frame will go to sleep until a tap gesture wakes it up.
   * @param seconds - The number of seconds to sleep.
   */
  function sleep(seconds?: number): void;

  /**
   * Reboots Frame into the firmware bootloader.
   */
  function update(): void;

  /**
   * Prevents Frame from going to sleep while it’s docked onto the charging cradle.
   * @param enable - Whether to enable or disable this function.
   */
  function stay_awake(enable: boolean): void;

  /**
   * Reads a number of bytes from the FPGA at the given address.
   * @param address - The address to read from.
   * @param num_bytes - The number of bytes to read.
   * @returns The read data.
   */
  function fpga_read(address: number, num_bytes: number): string;

  /**
   * Writes data to the FPGA at a given address.
   * @param address - The address to write to.
   * @param data - The data to write.
   */
  function fpga_write(address: number, data: string): void;

}