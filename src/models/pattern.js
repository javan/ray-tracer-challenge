import { Matrix } from "./matrix"
import { Color } from "./color"

export class Pattern extends Array {
  get transform() {
    return Matrix.IDENTITY
  }

  set transform(value) {
    Object.defineProperty(this, "transform", { value })
  }

  colorAtShape(shape, point) {
    if (shape) {
      point = shape.transform.inverse.multiplyBy(point)
    }
    if (this.transform !== Matrix.IDENTITY) {
      point = this.transform.inverse.multiplyBy(point)
    }
    return this.colorAt(point)
  }

  colorAt({ x, y, z }) {
    return Color.of(x, y, z)
  }
}
