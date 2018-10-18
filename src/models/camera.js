import { Matrix } from "./matrix"
import { Point } from "./position"
import { Ray } from "./ray"
import { Canvas } from "./canvas"

export class Camera {
  static create(...args) {
    return new Camera(...args)
  }

  constructor({ hsize, vsize, view, transform } = {}) {
    this.hsize = hsize
    this.vsize = vsize
    this.view = view
    this.transform = transform || Matrix.identity
  }

  rayForPixel(x, y) {
    const xoffset = (x + 0.5) * this.pixelSize
    const yoffset = (y + 0.5) * this.pixelSize

    const worldX = this.halfWidth - xoffset
    const worldY = this.halfHeight - yoffset

    const pixel = this.transform.inverse.multiplyBy(Point(worldX, worldY, - 1))
    const origin = this.transform.inverse.multiplyBy(Point(0, 0, 0))
    const direction = pixel.subtract(origin).normalize

    return new Ray(origin, direction)
  }

  render(world) {
    const canvas = new Canvas(this.hsize, this.vsize)
    for (const { x, y } of canvas) {
      const ray = this.rayForPixel(x, y)
      const color = world.colorAt(ray)
      canvas.writePixel(x, y, color)
    }
    return canvas
  }

  get pixelSize() {
    const value = (this.halfWidth * 2) / this.hsize
    Object.defineProperty(this, "pixelSize", { value })
    return value
  }

  get aspect() {
    const value = this.hsize / this.vsize
    Object.defineProperty(this, "aspect", { value })
    return value
  }

  get halfWidth() {
    const value = this.aspect >= 1
      ? this.halfView
      : this.halfView * this.aspect
    Object.defineProperty(this, "halfWidth", { value })
    return value
  }

  get halfHeight() {
    const value = this.aspect >= 1
      ? this.halfView / this.aspect
      : this.halfView
    Object.defineProperty(this, "halfHeight", { value })
    return value
  }

  get halfView() {
    const value = Math.tan(this.view / 2)
    Object.defineProperty(this, "halfView", { value })
    return value
  }
}
