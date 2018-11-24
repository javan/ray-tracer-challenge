import { PointLight } from "./point_light"
import { Point } from "./position"
import { Color } from "./color"
import { Matrix } from "./matrix"
import { Sphere } from "./shapes"
import { Intersections } from "./intersections"
import { Ray } from "./ray"

const MAX_RECURSIVE_DEPTH = 4

export class World extends Array {
  static get default() {
    const world = World.of(
      Sphere.create({
        color: Color.of(0.8, 1.0, 0.6),
        diffuse: 0.7,
        specular: 0.2
      }),
      Sphere.create({
        transform: Matrix.scaling(0.5, 0.5, 0.5)
      })
    )
    world.light = new PointLight(Point(-10, 10, -10), Color.WHITE)
    return world
  }

  intersect(ray) {
    return this.reduce((result, object) =>
      result.concat(ray.intersect(object))
    , new Intersections).sorted
  }

  shade(hit, remaining) {
    const { light } = this
    const { object, point, eyev, normalv } = hit
    const shadowed = this.isShadowed(point)
    const surface = object.material.lighting({ object, light, point, eyev, normalv, shadowed })
    const reflected = this.reflect(hit, remaining)
    return surface.add(reflected)
  }

  reflect(hit, remaining = MAX_RECURSIVE_DEPTH) {
    if (remaining <= 0 || hit.object.material.reflective == 0) {
      return Color.BLACK
    }
    const reflectRay = new Ray(hit.point, hit.reflectv)
    const color = this.colorAt(reflectRay, remaining - 1)
    return color.multiplyBy(hit.object.material.reflective)
  }

  refract(hit, remaining = MAX_RECURSIVE_DEPTH) {
    if (remaining <= 0 || hit.object.material.transparency == 0) {
      return Color.BLACK
    }

    const nRatio = hit.n1 / hit.n2
    const cosI = hit.eyev.dotProduct(hit.normalv)
    const sin2t = nRatio**2 * (1 - cosI**2)
    if (sin2t > 1) {
      return Color.BLACK
    }

    const cosT = Math.sqrt(1.0 - sin2t)
    const direction = hit.normalv.multiplyBy(nRatio * cosI - cosT).subtract(hit.eyev.multiplyBy(nRatio))
    const refractRay = new Ray(hit.underPoint, direction)
    const color = this.colorAt(refractRay, remaining - 1)
    return color.multiplyBy(hit.object.material.transparency)
  }

  colorAt(ray, remaining) {
    const { hit } = this.intersect(ray)
    if (hit) {
      hit.prepare(ray)
      return this.shade(hit, remaining)
    } else {
      return Color.BLACK
    }
  }

  isShadowed(point) {
    const vector = this.light.position.subtract(point)
    const distance = vector.magnitude
    const direction = vector.normalize

    const ray = new Ray(point, direction)
    const { hit } = this.intersect(ray)

    return hit ? hit.t < distance : false
  }
}
