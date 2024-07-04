interface DirectionData {
  heading: number;
  pitch: number;
  roll: number;
}

interface RawData {
  accelerometer: { x: number; y: number; z: number };
  compass: { x: number; y: number; z: number };
}

/**
 * The IMU class allows reading both accelerometer and compass data,
 * as well as assigning a callback function for tap gestures.
 * The tap gesture will always wake up Frame from frame.sleep().
 */
export class IMU {
  private tapHandler: (() => void) | null;

  constructor() {
    this.tapHandler = null;
  }

  /**
   * Returns an object containing the roll, pitch, and heading angles of the wearer’s head position.
   * @returns An object with roll, pitch, and heading properties.
   */
  direction(): DirectionData {
    // Replace with actual implementation
    const data: DirectionData = {
      heading: Math.random() * 360, // Mock data
      pitch: Math.random() * 360 - 180, // Mock data
      roll: Math.random() * 360 - 180, // Mock data
    };
    console.log(
      `Direction data: roll=${data.roll}, pitch=${data.pitch}, heading=${data.heading}`,
    );
    return data;
  }

  /**
   * Returns an object of the raw accelerometer and compass measurements,
   * each containing an object with x, y, and z values.
   * @returns An object with raw accelerometer and compass data.
   */
  raw(): RawData {
    // Replace with actual implementation
    const data: RawData = {
      accelerometer: {
        x: Math.random() * 10,
        y: Math.random() * 10,
        z: Math.random() * 10,
      }, // Mock data
      compass: {
        x: Math.random() * 10,
        y: Math.random() * 10,
        z: Math.random() * 10,
      }, // Mock data
    };
    console.log(
      `Raw data: accelerometer=${JSON.stringify(data.accelerometer)}, compass=${JSON.stringify(data.compass)}`,
    );
    return data;
  }

  /**
   * Simulates the tap event for testing purposes.
   */
  simulateTap(): void {
    if (this.tapHandler) {
      this.tapHandler();
    } else {
      console.log("No tap callback assigned.");
    }
  }

  /**
   * Assigns a callback to the tap gesture.
   * @param handler - The callback function to be executed on tap. Pass null to deactivate the callback.
   */
  tapCallback(handler: (() => void) | null): void {
    this.tapHandler = handler;
    if (handler) {
      console.log("Tap callback assigned.");
    } else {
      console.log("Tap callback deactivated.");
    }
  }
}
