
export function test() {
  const mtu = frame.bluetooth.max_length();

  frame.microphone.start({sample_rate: 16000}); // Start streaming at 16kHz 8bit

// Streams forever
  while (true) {
    const data = frame.microphone.read(mtu);

    // Calling frame.microphone.stop() will allow this to break the loop
    if (data === null) {
      break;
    }

    // If there's data to send then ...
    if (data !== "") {
      // Try to send the data as fast as possible
      while (true) {
        // If the Bluetooth is busy, this simply trys again until it gets through
        if (pcall(() => frame.bluetooth.send(data))[0] === false) {
          break;
        }
      }
    }
  }
}




