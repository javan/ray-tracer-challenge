import { Color } from "./color"
import { CanvasPPM } from "./canvas_ppm"

export class Canvas {
  constructor(width, height, fillColor = Color.of(0, 0, 0)) {
    this.width = width
    this.height = height
    this.fillColor = fillColor
    this.pixels = array(height, () => array(width, fillColor))
  }

  hasPixelAt(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  pixelAt(x, y) {
    if (this.hasPixelAt(x, y)) {
      return this.pixels[y][x]
    }
  }

  writePixel(x, y, color) {
    if (this.hasPixelAt(x, y)) {
      return this.pixels[y][x] = color
    }
  }

  toPPM() {
    return new CanvasPPM(this)
  }
}

const array = (length, fill) =>
  typeof fill == "function"
    ? Array.from({ length }, fill)
    : Array(length).fill(fill)
