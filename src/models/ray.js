import { Position } from "./position"
import { Intersection } from "./intersection"
import { Intersections } from "./intersections"

export class Ray {
  constructor(origin, direction) {
    this.origin = origin
    this.direction = direction
  }

  position(t) {
    return this.origin.add(this.direction.multiplyBy(t))
  }

  intersect(sphere) {
    const intersections = new Intersections
    const { origin, direction } = this.transform(sphere.transform.inverse)

    const sphereToRay = origin.subtract(Position.point(0, 0, 0))
    const a = direction.dotProduct(direction)
    const b = 2 * direction.dotProduct(sphereToRay)
    const c = sphereToRay.dotProduct(sphereToRay) - 1
    const discriminant = b * b - 4 * a * c

    if (discriminant >= 0) {
      const t1 = (-b - Math.sqrt(discriminant)) / (2 * a)
      const t2 = (-b + Math.sqrt(discriminant)) / (2 * a)
      const i1 = new Intersection(t1, sphere)
      const i2 = new Intersection(t2, sphere)
      t1 > t2
        ? intersections.push(i2, i1)
        : intersections.push(i1, i2)
    }

    return intersections
  }

  transform(matrix) {
    const origin = matrix.multiplyBy(this.origin)
    const direction = matrix.multiplyBy(this.direction)
    return new Ray(origin, direction)
  }
}
