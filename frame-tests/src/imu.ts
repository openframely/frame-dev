

function tapped() {
  frame.display.text('tapped', 50, 100);
  frame.display.show()
}

export function test() {
  const pitch = frame.imu.direction()['pitch'] // Prints the angle of the wears head (up or down)
  const roll = frame.imu.direction()['roll'] // Prints the angle of the wears head (left or right)
  frame.display.text(`Roll: ${roll}, Pitch: ${pitch}`, 50, 100)
  frame.display.show()
  frame.imu.tap_callback(tapped)
}