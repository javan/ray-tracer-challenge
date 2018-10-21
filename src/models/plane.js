import { Shape } from "./shape"
import { Vector } from "./position"
import { Intersection } from "./intersection"
import { Intersections } from "./intersections"

export class Plane extends Shape {
  normalAt() {
    return Vector(0, 1, 0)
  }

  intersect(ray) {
    const intersections = new Intersections
    if (Math.abs(ray.direction.y) >= 0.0001) {
      const t = ray.origin.negate.y / ray.direction.y
      intersections.push(new Intersection(t, this))
    }
    return intersections
  }
}
