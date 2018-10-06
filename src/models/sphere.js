import { Matrix } from "./matrix"
import { Position } from "./position"

export class Sphere {
  constructor() {
    this.transform = Matrix.identity
  }

  normalAt(worldPoint) {
    const objectPoint = this.transform.inverse.multiplyBy(worldPoint)
    const objectNormal = objectPoint.subtract(Position.point(0, 0, 0))
    const [ x, y, z ] = this.transform.inverse.transpose.multiplyBy(objectNormal)
    return Position.vector(x, y, z).normalize
  }
}
