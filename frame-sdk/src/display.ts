import { Frame } from "frame";

/**
 * The Display class allows drawing of text, sprites, and vectors.
 * These elements can be layered atop one another simply in the order they are called, and then displayed in one go using the show() function.
 * The Frame display is capable of rendering up to 16 colors at one time. These colors are preset by default, however, each color can be overridden by any 8-bit YCbCr color using the palette command.
 */
export class Display {
  private frame: Frame;

  constructor(frame: Frame) {
    this.frame = frame;
  }

  /**
   * Draws a bitmap on the display.
   * Details coming soon.
   */
  bitmap(): void {
    console.log("Bitmap drawn. Details coming soon.");
  }

  /**
   * Clears the display.
   */
  clear(): void {
    console.log("Display cleared.");
  }

  /**
   * Sets the display palette.
   * Details coming soon.
   */
  palette(): void {
    console.log("Palette set. Details coming soon.");
  }

  /**
   * Shows the drawn objects on the display.
   */
  async show(): Promise<void> {
    console.log("Displaying elements:");
    await this.frame.send("frame.display.show()");
  }

  /**
   * Prints the given string to the display at (x, y).
   * @param text - The text to print.
   * @param x - The x-coordinate of the text.
   * @param y - The y-coordinate of the text.
   * @param options - Optional parameters for color and alignment.
   *                  color: The color of the text. Defaults to 'WHITE'.
   *                  align: The alignment of the text. Defaults to 'TOP_LEFT'.
   */
  async text(
    text: string,
    x: number,
    y: number,
    options: {
      align?:
        | "BOTTOM_CENTER"
        | "BOTTOM_LEFT"
        | "BOTTOM_RIGHT"
        | "MIDDLE_CENTER"
        | "MIDDLE_LEFT"
        | "MIDDLE_RIGHT"
        | "TOP_CENTER"
        | "TOP_LEFT"
        | "TOP_RIGHT";
      color?: string;
    } = { align: "TOP_LEFT", color: "WHITE" },
  ): Promise<void> {
    const color = options.color ?? "WHITE";
    const align = options.align ?? "TOP_LEFT";
    const element = `Text: "${text}" at (${x}, ${y}), color: ${color}, align: ${align}`;
    await this.frame.send(`frame.display.text("${text}", ${x}, ${y})`);
  }

  /**
   * Draws a vector on the display.
   * Details coming soon.
   */
  vector(): void {
    console.log("Vector drawn. Details coming soon.");
  }
}
