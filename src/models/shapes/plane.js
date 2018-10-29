import { Shape } from "../shape"
import { Vector } from "../position"
import { Intersection, EPSILON } from "../intersection"
import { Intersections } from "../intersections"

export class Plane extends Shape {
  localNormalAt() {
    return Vector(0, 1, 0)
  }

  intersect(ray) {
    const intersections = new Intersections
    if (Math.abs(ray.direction.y) >= EPSILON) {
      const t = ray.origin.negate.y / ray.direction.y
      intersections.push(new Intersection(t, this))
    }
    return intersections
  }
}
