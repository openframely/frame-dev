// frame/display.d.ts

/** @noSelf */
declare module "display" {
    /**
     * The frame.display.assign_color function configures the display palette.
     */
    function assign_color(
      index: number,
      red: number,
      green: number,
      blue: number,
    ): void;

    /**
     * The frame.display.assign_color_ycbr function configures the display palette.
     */
    function assign_color(
      index: number,
      y: number,
      cb: number,
      cr: number,
    ): void;

    /**
     * The frame.display.set_brightness function configures the brightness of the display
     * level must be -2, -1, 0, 1, or 2
     */
    function set_brightness(
      level: number,
    ): void;

    /**
     * The frame.display.set_register function writes directly to the display registers
     */
    function set_register(
      address: number,
      value: number
    ): void;

    /**
     * Prints the given string to the display at x and y.
     * @param text - The string to print.
     * @param x - The x-coordinate.
     * @param y - The y-coordinate.
     * @param options - Optional parameters including color and alignment.
     */
    function text(
      text: string,
      x: number,
      y: number
    ): void;

    /**
     * Details coming soon
     */
    function bitmap(
      x: number,
      y: number,
      width: number,
      total_colors: number,
      palette_offset: number,
      pixel_data: string
    ): void;

    /**
     * Shows the drawn objects on the display.
     */
    function show(): void;

}