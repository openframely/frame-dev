import noble, { Characteristic, Peripheral } from "@abandonware/noble";
import { Bluetooth } from "bluetooth";
import { Camera } from "camera";
import { Display } from "display";
import { RemoteFileSystem } from "file";
import { IMU } from "imu";
import { Microphone } from "microphone";
import { Time } from "time";

// 7a230001-5475-a6a4-654c-8431f6ad49c4
const FRAME_UUID = "7a2300015475a6a4654c8431f6ad49c4";

// 7a230002-5475-a6a4-654c-8431f6ad49c4
const TX_CHARACTERISTIC_UUID = "7a2300025475a6a4654c8431f6ad49c4";

// 7a230003-5475-a6a4-654c-8431f6ad49c4
const RX_CHARACTERISTIC_UUID = "7a2300035475a6a4654c8431f6ad49c4";

export class Frame {
  bluetooth: Bluetooth = new Bluetooth();
  camera: Camera = new Camera();
  display: Display = new Display();

  file: RemoteFileSystem = new RemoteFileSystem();
  imu: IMU = new IMU();
  microphone: Microphone = new Microphone();
  peripheral: Peripheral | undefined = undefined;
  rx: Characteristic | undefined = undefined;
  time: Time = new Time();
  tx: Characteristic | undefined = undefined;

  battery_level(): number {
    return send_lua("print(frame.battery.level())", pri) as number;
  }

  async connect(timeout = 30): Promise<boolean> {
    let discovered = false;
    let connected = false;
    let intervalHandle: NodeJS.Timeout | undefined;

    function sleep(ms: number) {
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
      connected = true;

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
      discovered = true;

      noble.stopScanning();
      const name = peripheral.advertisement.localName;
      console.log(`Connecting to nearest '${name}' ${peripheral.id}`);
      acquireChannels(peripheral).then(() => {
        timeout = 0;
      });
    });

    await sleep(timeout * 1000);
    if (!discovered) {
      noble.stopScanning();
      console.log("No Frame found");
      return false;
    }

    return connected;
  }

  async disconnect(): Promise<void> {
    if (this.peripheral) {
      await this.peripheral.disconnectAsync();
    }
    await noble.stopScanningAsync();
    noble.removeAllListeners();
    noble._bindings.stop();
  }

  fpga_ready(address: number, num_bytes: number): Uint8Array {
    return new Uint8Array(0);
  }

  send_lua(str: string, show_me = false, await_print = false): void {
    if (show_me) {
      console.log(`Sending Lua: ${str}`);
    }

    this.tx?.write(Buffer.from(str), false, (error) => {
      if (error) {
        console.error(`Error writing to TX: ${error}`);
      }
    });
  }

  sleep(seconds: Ref<number> | null | number): void {
    console.log("Sleeping");
  }

  stay_awake(enable: boolean): void {
    console.log("Staying awake");
  }

  update() {
    console.log("Updating");
  }

  get FRAME_VERSION(): string {
    return "0.0.1";
  }

  get GIT_TAG(): string {
    return "v0.0.1";
  }
}

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
