import { color } from "./tuples"

export const canvas = (width, height, fillColor) => new Canvas(width, height, fillColor)

class Canvas {
  constructor(width, height, fillColor = color(0, 0, 0)) {
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
    return PPM.from(this)
  }

  toDOMCanvas() {
    const element = document.createElement("canvas")
    element.width = this.width
    element.height = this.height

    const context = element.getContext("2d")
    context.fillStyle = `rgb(${this.fillColor.rgb})`
    context.fillRect(0, 0, this.width, this.height)

    this.eachDirtyPixel((pixel, x, y) => {
      const imageData = new ImageData(pixel.rgba, 1, 1)
      context.putImageData(imageData, x, y)
    })

    return element
  }
}

class PPM {
  static from(canvas) {
    return new PPM(canvas).toString()
  }

  constructor(canvas) {
    this.canvas = canvas
  }

  toString() {
    return this.lines.join("\n") + "\n"
  }

  get lines() {
    return [
      ...this.headerLines,
      ...this.dataLines
    ]
  }

  get headerLines() {
    return [
      this.identifier,
      this.dimensions,
      this.maxColorValue
    ]
  }

  get dataLines() {
    const lines = []
    for (const row of this.canvas.pixels) {
      let line = []
      for (const color of row) {
        for (const number of color.rgb) {
          const data = number.toString()
          if (data.length + line.length * 4 > this.maxLineLength) {
            lines.push(line.join(" "))
            line = [data]
          } else {
            line.push(data)
          }
        }
      }
      if (line.length) {
        lines.push(line.join(" "))
      }
    }
    return lines
  }

  get identifier() {
    return "P3"
  }

  get dimensions() {
    return `${this.canvas.width} ${this.canvas.height}`
  }

  get maxColorValue() {
    return 255
  }

  get maxLineLength() {
    return 70
  }
}

const array = (length, fill) =>
  typeof fill == "function"
    ? Array.from({ length }, fill)
    : Array(length).fill(fill)
