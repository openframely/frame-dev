import { Frame } from "@framely/sdk/frame";

const frame: Frame = new Frame();

beforeAll(async () => {
  const success = await frame.connect(10);
  expect(success).toEqual(true);
});

afterAll(async () => {
  await frame?.disconnect();
});

it("is connected to Frame", async () => {
  expect(frame.connected).toEqual(true);
});

it("can send lua commands", async () => {
  const response = await frame.request("print('Hello, world!')", true);
  expect(response?.toString()).toEqual("Hello, world!");
});

it("can retrieve battery level", async () => {
  const level = await frame.battery_level();
  expect(level).toBeGreaterThanOrEqual(0);
});

it("can retrieve firmware version", async () => {
  const version = await frame.FIRMWARE_VERSION;
  expect(version).toMatch(/\d+\.\d+\.\d+/);
});

it("can retrieve git tag", async () => {
  const tag = await frame.GIT_TAG;
  expect(tag?.length).toEqual(7);
});

it("can display text", async () => {
  await frame.display.text("Hello, world!", 50, 140);
  await frame.display.show();
});
