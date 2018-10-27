import { Matrix } from "./matrix"
import { Point, Vector } from "./position"
import { Material } from "./material"

export class Shape {
  static create(...args) {
    return new this(...args)
  }

  constructor({ color, ambient, diffuse, specular, shininess, pattern, transform } = {}) {
    this.material = Material.create({ color, ambient, diffuse, specular, shininess, pattern })
    this.transform = transform || Matrix.IDENTITY
    Object.freeze(this)
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
