
export function test() {
  const mtu = frame.bluetooth.max_length()

// Auto expose for 3 seconds
  for (let i = 0; i < 30; i++) {
    frame.camera.auto()
    frame.sleep(0.1)
  }

// Capture an image using default settings
  frame.camera.capture() // NOTE: for devices running firmware prior to v24.179.0818, the {} should be ()

  while (true) {
    const data = frame.camera.read(mtu)
    if (data == null) {
      break
    }

    frame.bluetooth.send(data)
  }
}

