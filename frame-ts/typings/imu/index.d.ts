// frame/imu.d.ts

/** @noSelf */
declare module "imu" {

  /**
   * Returns a table containing the roll, pitch, and heading angles of the wearer’s head position.
   * @returns A table with roll, pitch, and heading values.
   */
  function direction(): { roll: number, pitch: number, heading: number };

  /**
   * Assigns a callback to the tap gesture.
   * @param handler - The function to call on tap gesture, or null to deactivate the callback.
   */
  function tap_callback(handler: (() => void) | null): void;

  /**
   * Returns a table of the raw accelerometer and compass measurements.
   * @returns A table with x, y, and z values for accelerometer and compass.
   */
  function raw(): {
    accelerometer: { x: number, y: number, z: number },
    compass: { x: number, y: number, z: number }
  };

}