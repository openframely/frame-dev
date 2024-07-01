// frame/bluetooth.d.ts

/** @noSelf */
declare module "bluetooth" {

  /**
   * Returns the device MAC address as a 17 character string.
   * @returns The MAC address.
   */
  function address(): string;

  /**
   * Returns the device connection status.
   * @returns the connection status.
   */
  function is_connected(): string;

  /**
   * Assigns a callback to handle received Bluetooth data.
   * @param handler - The function to call on data reception, or null to deactivate the callback.
   */
  function receive_callback(handler: ((data: string) => void) | null): void;

  /**
   * Returns the maximum length of data that can be sent or received in a single transfer.
   * @returns The maximum length.
   */
  function max_length(): number;

  /**
   * Sends data to the host device.
   * @param data - The data to send.
   */
  function send(data: string): void;

}