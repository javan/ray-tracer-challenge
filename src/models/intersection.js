export class Intersection {
  constructor(t, object) {
    this.t = t
    this.object = object
  }

  prepare(ray) {
    this.point = ray.position(this.t)
    this.eyev = ray.direction.negate
    this.normalv = this.object.normalAt(this.point)

    if (this.normalv.dotProduct(this.eyev) < 0) {
      this.inside = true
      this.normalv = this.normalv.negate
    } else {
      this.inside = false
    }
  }
}
