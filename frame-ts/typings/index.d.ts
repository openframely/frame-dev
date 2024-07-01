import "./bluetooth";
import "./camera";
import "./display";
import "./file";
import "./frame";
import "./imu";
import "./microphone";
import "./time";

declare module "frame" {
  const bluetooth: typeof import("bluetooth");
  const camera: typeof import("camera");
  const display: typeof import("display");
  const file: typeof import("file");
  const imu: typeof import("imu");
  const microphone: typeof import("microphone");
  const time: typeof import("time");
}