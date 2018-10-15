import { PointLight } from "./point_light"
import { Position } from "./position"
import { Color } from "./color"
import { Matrix } from "./matrix"
import { Sphere } from "./sphere"
import { Intersections } from "./intersections"

export class World extends Array {
  static get default() {
    const s1 = new Sphere
    s1.material.color = Color.of(0.8, 1.0, 0.6)
    s1.material.diffuse = 0.7
    s1.material.specular = 0.2

    const s2 = new Sphere
    s2.transform = Matrix.scaling(0.5, 0.5, 0.5)

    const world = World.of(s1, s2)
    world.light = new PointLight(Position.point(-10, 10, -10), Color.of(1, 1, 1))
    return world
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
      return BLACK
    }
  }
}

const BLACK = Color.of(0, 0, 0)
