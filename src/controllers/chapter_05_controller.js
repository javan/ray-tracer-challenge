import { Color, Matrix, Position, Ray, Sphere } from "../models"
import { nextFrame, nextIdle, DOMCanvasProxy } from "../helpers"
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "transformInput", "preview" ]

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
    const rayOrigin = Position.point(0, 0, -5)

    const sphere = new Sphere
    sphere.transform = this.transform

    const wallZ = 10
    const wallSize = 7.0

    const canvasSize = 150
    const pixelSize = wallSize / canvasSize
    const halfSize = wallSize / 2

    const canvas = new DOMCanvasProxy(canvasSize, canvasSize)
    const color = Color.of(0, 0, 1)

    for (let y = 0; y < canvasSize; y++) {
      const worldY = halfSize - pixelSize * y
      for (let x = 0; x < canvasSize; x++) {
        const worldX = -halfSize + pixelSize * x
        const position = Position.point(worldX, worldY, wallZ)
        const ray = new Ray(rayOrigin, position.subtract(rayOrigin))
        const { hit } = ray.intersect(sphere)
        if (hit) {
          canvas.writePixel(x, y, color)
        }
      }
    }

    return canvas
  }

  get transform() {
    return this.transforms.reduce((result, value) => result.multiplyBy(value))
  }

  get transforms() {
    const inputs = this.transformInputTargets.filter(e => e.checked)
    const transforms = inputs.map(e => TRANSFORMS[e.value])
    return [Matrix.identity, ...transforms]
  }
}

const TRANSFORMS = {
  shrinkY: Matrix.scaling(1, 0.5, 1),
  shrinkX: Matrix.scaling(0.5, 1, 1),
  rotate: Matrix.rotationZ(Math.PI / 4),
  skew: Matrix.shearing(1, 0, 0, 0, 0, 0)
}
