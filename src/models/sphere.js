import { Matrix } from "./matrix"
import { Point, Vector } from "./position"
import { Material } from "./material"

export class Sphere {
  static create(...args) {
    return new Sphere(...args)
  }

  constructor({ color, ambient, diffuse, specular, shininess, transform } = {}) {
    this.material = Material.create({ color, ambient, diffuse, specular, shininess })
    this.transform = transform || Matrix.identity
  }

  normalAt(worldPoint) {
    const objectPoint = this.transform.inverse.multiplyBy(worldPoint)
    const objectNormal = objectPoint.subtract(Point(0, 0, 0))
    const [ x, y, z ] = this.transform.inverse.transpose.multiplyBy(objectNormal)
    return Vector(x, y, z).normalize
  }
}
