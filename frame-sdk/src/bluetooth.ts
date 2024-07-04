/**
 * The Bluetooth class allows for sending and receiving raw byte data over Bluetooth.
 */
export class Bluetooth {
  private receiveHandler: ((data: string) => void) | null;

  constructor() {
    this.receiveHandler = null;
  }

  connect(): void {
    console.log("Connected to nearest Frame.");
  }

  /**
   * Returns the device MAC address as a 17 character string.
   * @returns The device MAC address.
   */
  address(): string {
    // Replace with actual implementation
    const macAddress = "4E:87:B5:0C:64:0F"; // Mock data
    console.log(`MAC Address: ${macAddress}`);
    return macAddress;
  }

  /**
   * Assigns a callback to handle received Bluetooth data.
   * @param handler - The callback function to handle received data. Pass null to deactivate the callback.
   */
  receiveCallback(handler: ((data: string) => void) | null): void {
    this.receiveHandler = handler;
    if (handler) {
      console.log("Receive callback assigned.");
    } else {
      console.log("Receive callback deactivated.");
    }
  }

  /**
   * Returns the maximum length of data that can be sent or received in a single transfer.
   * @returns The maximum length of data.
   */
  maxLength(): number {
    // Replace with actual implementation
    const maxLength = 512; // Mock data
    console.log(`Max Length: ${maxLength}`);
    return maxLength;
  }

  /**
   * Sends data to the host device.
   * @param data - The data to send. Must be a string, but can contain byte values including 0x00 values anywhere in the string. The total length of the string must be less than or equal to frame.bluetooth.max_length().
   */
  send(data: string): void {
    const maxLength = this.maxLength();
    if (data.length > maxLength) {
      throw new Error(`Data length exceeds maximum allowed length of ${maxLength}`);
    }
    console.log(`Data sent: ${data}`);
    // Replace with actual implementation to send data
  }

  /**
   * Simulates the reception of data for testing purposes.
   * @param data - The data to be received.
   */
  simulateReceive(data: string): void {
    if (this.receiveHandler) {
      this.receiveHandler(data);
    } else {
      console.log("No receive callback assigned.");
    }
  }
}

