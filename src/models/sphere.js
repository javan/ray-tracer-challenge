import { Matrix } from "./matrix"
import { Position } from "./position"
import { Material } from "./material"

export class Sphere {
  constructor() {
    this.transform = Matrix.identity
    this.material = new Material
  }

  normalAt(worldPoint) {
    const objectPoint = this.transform.inverse.multiplyBy(worldPoint)
    const objectNormal = objectPoint.subtract(Position.point(0, 0, 0))
    const [ x, y, z ] = this.transform.inverse.transpose.multiplyBy(objectNormal)
    return Position.vector(x, y, z).normalize
  }
}
