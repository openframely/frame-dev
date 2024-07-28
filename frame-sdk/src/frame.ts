import noble, { Characteristic, Peripheral } from "@abandonware/noble";
import { Accumulator } from "accumulator";
import { Bluetooth } from "bluetooth";
import { Camera } from "camera";
import { Display } from "display";
import { RemoteFileSystem } from "file";
import { IMU } from "imu";
import { Microphone } from "microphone";
import { Time } from "time";

/**
 * The unique identifier for a Frame.
 * '7a230001-5475-a6a4-654c-8431f6ad49c4'
 *
 * @type {string}
 * @constant
 */
const FRAME_UUID = "7a2300015475a6a4654c8431f6ad49c4";

/**
 * The universally unique identifier (UUID) for the TX characteristic.
 * '7a230002-5475-a6a4-654c-8431f6ad49c4'
 * @type {string}
 */
const TX_CHARACTERISTIC_UUID = "7a2300025475a6a4654c8431f6ad49c4";

/**
 * The UUID for the RX characteristic.
 *
 * '7a230003-5475-a6a4-654c-8431f6ad49c4'
 *
 * @type {string}
 */
const RX_CHARACTERISTIC_UUID = "7a2300035475a6a4654c8431f6ad49c4";

/**
 * Represents a Frame object that provides access to various functionalities of the Frame device.
 */
export class Frame {
  accumulator: Accumulator = new Accumulator();
  bluetooth: Bluetooth = new Bluetooth();
  camera: Camera = new Camera();
  connected = false;

  discovered = false;
  display: Display = new Display(this);

  file: RemoteFileSystem = new RemoteFileSystem(this);
  imu: IMU = new IMU();
  microphone: Microphone = new Microphone();

  peripheral: Peripheral | undefined = undefined;
  rx: Characteristic | undefined = undefined;
  time: Time = new Time();
  tx: Characteristic | undefined = undefined;

  /**
   * Retrieves the battery level of the frame device.
   *
   * This method sends a request to the frame device to get the current battery level.
   * It awaits the response, which is expected to be a string that can be parsed into a number.
   * If no data is received in response to the request, it throws an error indicating that no data was received.
   *
   * @returns {Promise<number>} A promise that resolves to the battery level as a number.
   * @throws {Error} Throws an error if no data is received in response to the battery level request.
   */
  async battery_level(): Promise<number> {
    const data = await this.request("print(frame.battery_level())", true);
    if (!data) {
      throw new Error("No data received");
    }
    return parseFloat(data.toString());
  }

  /**
   * Initiates a connection to a Frame device within a specified timeout.
   *
   * This method attempts to connect to a Frame device by scanning for available devices and
   * establishing a connection with the first discovered device. It uses a countdown mechanism
   * to limit the connection attempt duration. If the connection is not established within the
   * specified timeout period, the method returns false to indicate failure.
   *
   * @param {number} timeout - The maximum time (in seconds) to attempt a connection before giving up.
   * @returns {Promise<boolean>} A promise that resolves to true if the connection was successful, or false if it timed out.
   *
   * TODO: Clean up the connect method to make it more readable and maintainable.
   */
  async connect(timeout = 30): Promise<boolean> {
    let intervalHandle: NodeJS.Timeout | undefined;

    function sleep() {
      return new Promise<void>((resolve) => {
        intervalHandle = setInterval(() => {
          console.log("Timeout: ", timeout);
          if (timeout-- <= 0) {
            console.log("Timeout expired.");
            clearInterval(intervalHandle);
            resolve();
          }
        }, 1000);
      });
    }

    const acquireChannels = async (peripheral: Peripheral): Promise<void> => {
      peripheral.on("disconnect", () =>
        console.log(
          `Disconnected from '${peripheral.advertisement.localName}' ${peripheral.id}`,
        ),
      );

      peripheral.on("data", () => {
        console.log(
          `Received data from '${peripheral.advertisement.localName}' ${peripheral.id}`,
        );
      });

      await peripheral.connectAsync();
      console.log(
        `Connected to '${peripheral.advertisement.localName}' ${peripheral.id}`,
      );
      this.connected = true;

      const servicesAndCharacteristics =
        await peripheral.discoverAllServicesAndCharacteristicsAsync();
      const characteristics = servicesAndCharacteristics.characteristics;
      this.tx = characteristics.find((c) => c.uuid == TX_CHARACTERISTIC_UUID);
      this.rx = characteristics.find((c) => c.uuid == RX_CHARACTERISTIC_UUID);
      if (this.tx) {
        console.log("TX Characteristic found");
      }
      if (this.rx) {
        console.log("RX Characteristic found");
        await this.rx.notifyAsync(true);

        this.rx?.on("data", (data) => {
          console.log(`Received data (rx): ${data.toString()}`);
          this.accumulator.accumulate(data.valueOf());
        });
      }
    };

    noble.on("stateChange", async (state) => {
      if (state === "poweredOn") {
        console.log("Scanning for nearest Frame...");
        await noble.startScanning([FRAME_UUID], false);
      } else {
        await noble.stopScanning();
      }
    });

    noble.on("discover", (peripheral) => {
      // we have a peripheral
      this.peripheral = peripheral;

      // connect to the first peripheral that is scanned
      this.discovered = true;

      noble.stopScanning();
      const name = peripheral.advertisement.localName;
      console.log(`Connecting to nearest '${name}' ${peripheral.id}`);
      acquireChannels(peripheral).then(() => {
        timeout = 0;
      });
    });

    await sleep();
    if (!this.discovered) {
      noble.stopScanning();
      console.log("No Frame found");
      return false;
    }

    return this.connected;
  }

  /**
   * Asynchronously disconnects from the Frame device and stops scanning for BLE devices.
   *
   * This method first checks if there is a currently connected peripheral device. If so, it
   * initiates an asynchronous disconnection process. Regardless of the connection status, it
   * then proceeds to asynchronously stop the BLE scanning process. This is essential for
   * cleaning up resources and ensuring the application does not continue to search for devices
   * after it has been instructed to disconnect.
   *
   * Note: The line `//noble._bindings.stop();` is commented out, indicating that direct
   * manipulation of the noble bindings was considered but is not currently in use. This could
   * be for cleanup purposes or to prevent potential issues with the BLE adapter state.
   *
   * @returns {Promise<void>} A promise that resolves once the disconnection and the stopping
   * of scanning have been completed.
   */
  async disconnect(): Promise<void> {
    if (this.peripheral) {
      await this.peripheral.disconnectAsync();
    }
    await noble.stopScanningAsync();
    // eslint-disable-next-line etc/no-commented-out-code
    noble._bindings.stop();
  }

  async expect(str: string, num: number): Promise<string[]> {
    const result: string[] = [];
    this.accumulator.expect(num);
    await this.request(str);
    for await (const chunk of this.accumulator) {
      if (chunk) {
        result.push(chunk.toString());
      } else {
        break;
      }
    }
    return result;
  }

  fpga_read(address: number, num_bytes: number): Uint8Array {
    return new Uint8Array(0);
  }

  async read(): Promise<Buffer | undefined> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        console.log("Reading data");
        this.rx?.read((error, data) => {
          if (error) {
            console.error(`Error reading data: ${error}`);
            reject();
          }
          console.log(`Received response: ${data?.toString()}`);
          clearInterval(interval);
          resolve(data);
        });
      }, 500);
    });
  }

  receive_data(): Uint8Array | undefined {
    this.rx?.readAsync().then((data) => {
      console.log(`Received data: ${data.toString()}`);
      return data.valueOf();
    });

    return undefined;
  }

  /**
   * Sends a request to the Frame device and awaits its response.
   *
   * This method is responsible for sending a request to the Frame device. It first logs the request if `echo` is true,
   * indicating that the request should be echoed to the console for debugging purposes. It then sends the request
   * using the TX characteristic of the device. The method waits for a response from the RX characteristic, logging
   * the received data or any errors encountered during the read operation. The response is returned as a `Buffer`
   * if successful, or `undefined` if an error occurs or no data is received.
   *
   * @param {string} str - The request string to be sent to the Frame device.
   * @param {boolean} [echo=false] - Whether to log the request to the console.
   * @returns {Promise<Buffer | undefined>} A promise that resolves with the response from the Frame device as a Buffer,
   * or undefined if an error occurs or no data is received.
   */
  async request(str: string, echo = false): Promise<Buffer | undefined> {
    if (echo) {
      console.log(`Sending Lua request: ${str}`);
    }

    await this.tx?.writeAsync(Buffer.from(str, "utf8"), false);

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        console.log("Reading data");
        this.rx?.read((error, data) => {
          if (error) {
            console.error(`Error reading data: ${error}`);
          }
          console.log(`Received response: ${data?.toString()}`);
          clearInterval(interval);
          resolve(data);
        });
      }, 500);
    });
  }

  /**
   * Sends a Lua command to the Frame device.
   *
   * This method sends a Lua command to the Frame device using the TX characteristic. It logs the command if `echo`
   * is true, indicating that the command should be echoed to the console for debugging purposes. The method awaits
   * the completion of the write operation and returns true if the operation is successful.
   *
   * @param {string} str - The Lua command to be sent to the Frame device.
   * @param {boolean} [echo=false] - Whether to log the Lua command to the console.
   * @returns {Promise<boolean>} A promise that resolves to true if the Lua command is successfully sent.
   */
  async send(str: string, echo = false): Promise<boolean> {
    if (echo) {
      console.log(`Sending Lua: ${str}`);
    }

    await this.tx?.writeAsync(Buffer.from(str, "utf8"), true);
    return true;
  }

  /**
   * Puts the Frame device to sleep for a specified duration.
   * @param seconds
   */
  async sleep(seconds: number): Promise<void> {
    await this.send(`frame.sleep(${seconds})`);
  }

  /**
   * Asynchronously sets the Frame device's sleep mode state.
   *
   * This method controls the sleep mode of the Frame device by sending a command to either
   * enable or disable the sleep mode. The command is sent using the `send` method, which
   * transmits the command to the device via the TX characteristic. The method awaits the
   * completion of the command transmission, ensuring that the sleep mode state is set as
   * requested.
   *
   * @param {boolean} enable - A boolean value where `true` enables sleep mode and `false` disables it.
   * @returns {Promise<void>} A promise that resolves once the command to set the sleep mode state has been sent.
   */
  async stay_awake(enable: boolean): Promise<void> {
    await this.send(`frame.stay_awake(${enable})`);
  }

  /**
   * Asynchronously updates the Frame device.
   *
   * This method sends a command to the Frame device to initiate its update process. The command is sent
   * using the `send` method, which transmits the command to the device via the TX characteristic. The method
   * awaits the completion of the command transmission before resolving, indicating that the update command
   * has been sent to the device. Note that this method does not wait for the update process on the device to
   * complete, but merely sends the command to initiate the update.
   *
   * @returns {Promise<void>} A promise that resolves when the update command has been sent.
   */
  async update(): Promise<void> {
    await this.send("frame.update()");
  }

  /**
   * Asynchronously retrieves the firmware version of the Frame device.
   *
   * This property getter executes an asynchronous function that sends a request to the Frame device
   * to retrieve the current firmware version. The firmware version is expected to be a string that
   * identifies the version of the firmware running on the device. If the request is successful, the
   * method returns the firmware version as a string. In case of any error during the request, it
   * returns an empty string as a fallback value.
   *
   * @returns {Promise<string | undefined>} A promise that resolves to the firmware version as a string,
   * or undefined if the request fails.
   */
  get FIRMWARE_VERSION(): Promise<string | undefined> {
    return (async () => {
      try {
        const data = await this.request("print(frame.FIRMWARE_VERSION)", true);
        return data?.toString();
      } catch (e) {
        return ""; // fallback value
      }
    })();
  }

  /**
   * Asynchronously retrieves the GIT tag of the Frame device.
   *
   * This getter method executes an asynchronous function that sends a request to the Frame device
   * to retrieve the current GIT tag. The GIT tag is expected to be a string that identifies the
   * git commit of the firmware running on the device. If the request is successful, the method
   * returns the GIT tag as a string. In case of any error during the request, it returns an empty
   * string as a fallback value.
   *
   * @returns {Promise<string | undefined>} A promise that resolves to the GIT tag as a string, or
   * undefined if the request fails.
   */
  get GIT_TAG(): Promise<string | undefined> {
    return (async () => {
      try {
        const data = await this.request("print(frame.GIT_TAG)", true);
        return data?.toString();
      } catch (e) {
        return ""; // fallback value
      }
    })();
  }
}

/**
 * Handles cleanup and resource management on process termination signals.
 *
 * This section of code listens for SIGINT, SIGQUIT, and SIGTERM signals, which are typically
 * sent to the process to request its termination. These signals can be triggered by the user
 * (e.g., pressing Ctrl+C in the terminal) or by the system (e.g., when shutting down). Upon
 * receiving any of these signals, the code logs a message indicating that an interrupt signal
 * was caught. It then instructs the `noble` library to stop scanning for Bluetooth Low Energy
 * (BLE) devices, which is an asynchronous operation. After stopping the scan, it exits the
 * process cleanly with `process.exit()`, ensuring that no resources are left hanging and that
 * the application shuts down gracefully.
 */

process.on("SIGINT", function () {
  console.log("Caught interrupt signal");
  noble.stopScanning(() => process.exit());
});

process.on("SIGQUIT", function () {
  console.log("Caught interrupt signal");
  noble.stopScanning(() => process.exit());
});

process.on("SIGTERM", function () {
  console.log("Caught interrupt signal");
  noble.stopScanning(() => process.exit());
});
