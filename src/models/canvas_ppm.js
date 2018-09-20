export class CanvasPPM {
  static from(canvas) {
    return new CanvasPPM(canvas).toString()
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
