import { color } from "./tuples"

export const canvas = (width, height) => new Canvas(width, height)

class Canvas {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.pixels = fill(width, () => fill(height, black))
  }

  pixelAt(x, y) {
    return this.pixels[x][y]
  }

  writePixel(x, y, value) {
    this.pixels[x][y] = value
  }
}

const black = color(0, 0, 0)

const fill = (length, value) =>
  typeof value == "function"
    ? Array.from({ length }, value)
    : Array(length).fill(value)
