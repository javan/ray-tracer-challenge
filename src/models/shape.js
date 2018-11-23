import { Matrix } from "./matrix"
import { Point, Vector } from "./position"
import { Material } from "./material"

export class Shape {
  static create(attributes = {}) {
    return new this(attributes)
  }

  static glass(attributes = {}) {
    return this.create({ transparency: 1.0, refractive: 1.5, ...attributes })
  }

  constructor(attributes) {
    this.material = Material.create(attributes)
    this.transform = attributes.transform || Matrix.IDENTITY
  }

  normalAt(point) {
    const localPoint  = this.transform.inverse.multiplyBy(point)
    const localNormal = this.localNormalAt(localPoint)
    const worldNormal = this.transform.inverse.transpose.multiplyBy(localNormal)
    return Vector(...worldNormal).normalize
  }

  localNormalAt(point) {
    return Vector(...point)
  }

  intersect(ray) {
    throw new Error("Must be implemented in subclass")
  }
}
