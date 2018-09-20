import { Color } from "./color"
import { CanvasPPM } from "./canvas_ppm"

export class Canvas {
  constructor(width, height, fillColor = Color.of(0, 0, 0)) {
    this.width = width
    this.height = height
    this.fillColor = fillColor
    this.pixels = array(height, () => array(width, fillColor))
    this.dirtyPixels = new Map
  }

  hasPixelAt(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  pixelAt(x, y) {
    if (this.hasPixelAt(x, y)) {
      return this.pixels[y][x]
    }
  }

  writePixel(x, y, value) {
    if (this.hasPixelAt(x, y)) {
      this.pixels[y][x] = value
      const key = JSON.stringify({ x, y })
      this.dirtyPixels.set(key, value)
    }
  }

  eachDirtyPixel(callback) {
    this.dirtyPixels.forEach((pixel, key) => {
      const { x, y } = JSON.parse(key)
      callback(pixel, x, y)
    })
  }

  toPPM() {
    return new CanvasPPM(this)
  }
}

const array = (length, fill) =>
  typeof fill == "function"
    ? Array.from({ length }, fill)
    : Array(length).fill(fill)
