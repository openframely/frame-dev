import { Display } from "./display";
import { Camera } from "./camera";
import { Bluetooth } from "./bluetooth";
import noble, { Characteristic, Peripheral } from "@abandonware/noble";

const FRAME_UUID = "7a230001-5475-a6a4-654c-8431f6ad49c4";
const TX_CHARACTERISTIC_UUID = "7a230002-5475-a6a4-654c-8431f6ad49c4";
const RX_CHARACTERISTIC_UUID = "7a230003-5475-a6a4-654c-8431f6ad49c4";

class System {
  peripheral: Peripheral | undefined = undefined;
  tx: Characteristic | undefined = undefined;
  rx: Characteristic | undefined = undefined;

  bluetooth: Bluetooth = new Bluetooth();
  camera: Camera = new Camera();
  display: Display = new Display();
  file: Filesystem = new Filesystem();
  imu: IMU = new IMU();
  microphone: Microphone = new Microphone();
  time: Time = new Time();

  constructor() {
    console.log("System");
  }

  async connect(timeout: number = 30): Promise<boolean> {
    const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

    const peripheral = new Promise<Peripheral>(async (resolve, reject) => {
      noble.on("stateChange", (state) => {
        if (state === "poweredOn") {
          console.log("Scanning for nearest Frame.");
          noble.startScanning([FRAME_UUID], false);
        } else {
          noble.stopScanning();
        }
      });

      noble.on("discover", (peripheral) => {
        // connect to the first peripheral that is scanned
        noble.stopScanning();
        const name = peripheral.advertisement.localName;
        console.log(`Connecting to nearest '${name}' ${peripheral.id}`);
        resolve(peripheral);
      });

      await sleep(timeout);
      reject("Scanning timeout - no Frame found.");
    });

    return peripheral.then(async (peripheral) => {
      return new Promise<boolean>(async (resolve, reject) => {
        peripheral.connect((error) => {
          if (error) {
            reject(error);
          } else {
            console.log(`Connected to '${peripheral.advertisement.localName}' ${peripheral.id}`);
            peripheral.on("disconnect", () => console.log(`Disconnected from '${peripheral.advertisement.localName}' ${peripheral.id}`));
            peripheral.discoverAllServicesAndCharacteristics((error, services, characteristics) => {
                if (error) {
                  reject(error);
                } else {
                  this.tx = characteristics.find((c) => c.uuid === TX_CHARACTERISTIC_UUID);
                  this.rx = characteristics.find((c) => c.uuid === RX_CHARACTERISTIC_UUID);
                  resolve(true);
                }
              }
            );
            reject(false);
          }
        });
      });
    });
  }

  get FRAME_VERSION(): string {
    return "0.0.1";
  }

  get GIT_TAG(): string {
    return "v0.0.1";
  }

  battery_level(): number {
    return 100;
  }

  sleep(seconds: number | Ref<number> | null): void {
    console.log("Sleeping");
  }

  update() {
    console.log("Updating");
  }

  stay_awake(enable: boolean): void {
    console.log("Staying awake");
  }

  fpga_ready(address: number, num_bytes: number): Uint8Array {
    return new Uint8Array(0);
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

export const frame = new System();

