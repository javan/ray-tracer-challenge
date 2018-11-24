export const EPSILON = 0.000001

export class Intersection {
  constructor(t, object) {
    this.t = t
    this.object = object
  }

  prepare(ray, intersections) {
    this.point = ray.position(this.t)
    this.eyev = ray.direction.negate
    this.normalv = this.object.normalAt(this.point)
    this.reflectv = ray.direction.reflect(this.normalv)

    if (this.normalv.dotProduct(this.eyev) < 0) {
      this.inside = true
      this.normalv = this.normalv.negate
    } else {
      this.inside = false
    }

    const { point } = this
    const offset = this.normalv.multiplyBy(EPSILON)
    this.point = point.add(offset)
    this.underPoint = point.subtract(offset)

    if (intersections) {
      const objects = new Set

      for (const intersection of intersections) {
        const { object } = intersection

        if (intersection === this) {
          this.n1 = objects.size ? last(objects).material.refractive : 1.0
        }

        objects.has(object) ? objects.delete(object) : objects.add(object)

        if (intersection === this) {
          this.n2 = objects.size ? last(objects).material.refractive : 1.0
          break
        }
      }
    }
  }

  get reflectance() {
    const value = this.schlick
    Object.defineProperty(this, "reflectance", { value })
    return value
  }

  get schlick() {
    const { n1, n2 } = this
    let cos = this.eyev.dotProduct(this.normalv)
    if (n1 > n2) {
      const n = n1 / n2
      const sin2t = n**2 * (1.0 - cos**2)
      if (sin2t > 1.0) {
        return 1.0
      }
      cos = Math.sqrt(1.0 - sin2t)
    }
    const r0 = ((n1 - n2) / (n1 + n2))**2
    return r0 + (1 - r0) * (1 - cos)**5
  }
}

function last(set) {
  return Array.from(set).slice(-1)[0]
}
