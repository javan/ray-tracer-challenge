import { Shape } from "./shape"
import { Point } from "./position"
import { Intersection } from "./intersection"
import { Intersections } from "./intersections"

export class Sphere extends Shape {
  intersect(ray) {
    const intersections = new Intersections

    const vectorToRay = ray.origin.subtract(Point(0, 0, 0))
    const a = ray.direction.dotProduct(ray.direction)
    const b = 2 * ray.direction.dotProduct(vectorToRay)
    const c = vectorToRay.dotProduct(vectorToRay) - 1
    const discriminant = b * b - 4 * a * c

    if (discriminant >= 0) {
      const t1 = (-b - Math.sqrt(discriminant)) / (2 * a)
      const t2 = (-b + Math.sqrt(discriminant)) / (2 * a)
      const i1 = new Intersection(t1, this)
      const i2 = new Intersection(t2, this)
      t1 > t2
        ? intersections.push(i2, i1)
        : intersections.push(i1, i2)
    }

    return intersections
  }
}
