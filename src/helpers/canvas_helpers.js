import { Canvas } from "../models"

export class DOMCanvasProxy extends Canvas {
  constructor() {
    super(...arguments)

    this.element = document.createElement("canvas")
    this.element.width = this.width
    this.element.height = this.height
    this.element.style.width = `${this.width / window.devicePixelRatio}px`
    this.element.style.height = `${this.height / window.devicePixelRatio}px`

    this.context = this.element.getContext("2d")
    this.context.fillStyle = `rgb(${this.fillColor.rgb})`
    this.context.fillRect(0, 0, this.width, this.height)
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
