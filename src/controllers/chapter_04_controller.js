import { nextFrame, nextIdle, DOMCanvasProxy } from "../helpers"
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "sizeInput", "radiusInput", "preview" ]

  connect() {
    this.render()
  }

  async render() {
    await nextIdle()
    const { element } = this.canvas

    await nextFrame()
    this.previewTarget.innerHTML = ""
    this.previewTarget.appendChild(element)
  }

  async download(event) {
    const blob = this.canvas.toPPM().toBlob()
    const url = URL.createObjectURL(blob)
    event.currentTarget.href = url

    await nextFrame()
    URL.revokeObjectURL(url)
  }

  get canvas() {
    const { size, radius } = this
    const canvas = new DOMCanvasProxy(size, size)
    const color = Color.of(0, 1, 0)
    const start = Point(0, 1, 0)

    for (let hour = 1; hour <= 12; hour++) {
      const rotation = Matrix.rotationZ(hour * Math.PI / 6)
      const position = rotation.multiplyBy(start)

      const x = Math.round(position.x * radius + size / 2)
      const y = Math.round(position.y * radius + size / 2)

      canvas.writePixel(x, y, color)
      canvas.writePixel(x + 1, y, color)
      canvas.writePixel(x + 1, y + 1, color)
      canvas.writePixel(x, y + 1, color)
    }

    return canvas
  }

  get size() {
    return parseInt(this.sizeInputTarget.value)
  }

  get radius() {
    return parseInt(this.radiusInputTarget.value)
  }
}
