import { PointLight } from "./point_light"
import { Point } from "./position"
import { Color } from "./color"
import { Matrix } from "./matrix"
import { Sphere } from "./sphere"
import { Intersections } from "./intersections"
import { Ray } from "./ray"

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
    return Object.seal(world)
  }

  intersect(ray) {
    return this.reduce((result, object) =>
      result.concat(ray.intersect(object))
    , new Intersections).sorted
  }

  shade(hit) {
    return hit.object.material.lighting(this.light, hit.point, hit.eyev, hit.normalv)
  }

  colorAt(ray) {
    const { hit } = this.intersect(ray)
    if (hit) {
      hit.prepare(ray)
      return this.shade(hit)
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
