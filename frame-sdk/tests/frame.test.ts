import { Frame } from "@framely/sdk/frame";

it("can connect to Frame", async () => {
  const frame = new Frame();
  const success = await frame.connect(10);
  await frame.disconnect();
  expect(success).toEqual(true);
});
