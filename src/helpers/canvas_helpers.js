import { Canvas, Color } from "../models"

const DPR = window.devicePixelRatio

export class DOMCanvasProxy extends Canvas {
  constructor() {
    super(...arguments)
    this.element = createCanvasElement(this.width, this.height, this.fillColor)
    this.context = this.element.getContext("2d")
  }

  writePixel(x, y, color) {
    const result = super.writePixel(x, y, color)
    if (result) {
      const imageData = new ImageData(color.rgba, 1, 1)
      this.context.putImageData(imageData, x, y)
    }
    return result
  }
}

export function createCanvasElement(width, height, fillColor = Color.BLACK) {
  const element = document.createElement("canvas")
  const context = element.getContext("2d")

  element.width = width
  element.height = height
  element.style.width = `${width / DPR}px`
  element.style.height = `${height / DPR}px`

  context.fillStyle = `rgb(${fillColor.rgb})`
  context.fillRect(0, 0, width, height)

  return element
}
