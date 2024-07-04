/**
 * The Display class allows drawing of text, sprites, and vectors.
 * These elements can be layered atop one another simply in the order they are called, and then displayed in one go using the show() function.
 * The Frame display is capable of rendering up to 16 colors at one time. These colors are preset by default, however, each color can be overridden by any 8-bit YCbCr color using the palette command.
 */
export class Display {
  private elements: Array<string>;

  constructor() {
    this.elements = [];
  }

  /**
   * Sets the display palette.
   * Details coming soon.
   */
  palette(): void {
    console.log("Palette set. Details coming soon.");
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
  text(
    text: string,
    x: number,
    y: number,
    options: {
      color?: string;
      align?: "TOP_LEFT" | "TOP_CENTER" | "TOP_RIGHT" | "MIDDLE_LEFT" | "MIDDLE_CENTER" | "MIDDLE_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_CENTER" | "BOTTOM_RIGHT"
    } = {color: "WHITE", align: "TOP_LEFT"}
  ): void {
    const color = options.color ?? "WHITE";
    const align = options.align ?? "TOP_LEFT";
    const element = `Text: "${text}" at (${x}, ${y}), color: ${color}, align: ${align}`;
    this.elements.push(element);
    console.log(element);
  }

  /**
   * Draws a bitmap on the display.
   * Details coming soon.
   */
  bitmap(): void {
    console.log("Bitmap drawn. Details coming soon.");
  }

  /**
   * Draws a vector on the display.
   * Details coming soon.
   */
  vector(): void {
    console.log("Vector drawn. Details coming soon.");
  }

  /**
   * Shows the drawn objects on the display.
   */
  show(): void {
    console.log("Displaying elements:");
    this.elements.forEach(element => {
      console.log(element);
    });
    this.elements = [];
  }

  /**
   * Clears the display.
   */
  clear(): void {
    this.elements = [];
    console.log("Display cleared.");
  }
}

