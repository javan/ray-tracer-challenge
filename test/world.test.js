import test from "ava"
import { World, PointLight, Position, Color, Sphere, Matrix, Ray } from "../src/models"

test("creating a world", t => {
  const w = new World
  t.is(w.length, 0)
  t.is(w.light, undefined)
})

test("the default world", t => {
  const light = new PointLight(Position.point(-10, 10, -10), Color.of(1, 1, 1))

  const s1 = new Sphere
  s1.color = Color.of(0.8, 1.0, 0.6)
  s1.diffuse = 0.7
  s1.specular = 0.2

  const s2 = new Sphere
  s2.transform = Matrix.scaling(0.5, 0.5, 0.5)

  const w = World.default
  t.deepEqual(w.light, light)
  t.deepEqual(w[0], s1)
  t.deepEqual(w[1], s2)
})

test("intersect a world with a ray", t => {
  const world = World.default
  const ray = new Ray(Position.point(0, 0, -5), Position.vector(0, 0, 1))
  const xs = world.intersect(ray)
  t.is(xs.length, 4)
  t.is(xs[0].t, 4)
  t.is(xs[1].t, 4.5)
  t.is(xs[2].t, 5.5)
  t.is(xs[3].t, 6)
})
