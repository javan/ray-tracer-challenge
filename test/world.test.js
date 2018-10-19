import test from "ava"
import { World, PointLight, Point, Vector, Color, Sphere, Matrix, Ray, Intersection } from "../src/models"

test("creating a world", t => {
  const w = new World
  t.is(w.length, 0)
  t.is(w.light, undefined)
})

test("the default world", t => {
  const light = new PointLight(Point(-10, 10, -10), Color.of(1, 1, 1))

  const s1 = Sphere.create({
    color: Color.of(0.8, 1.0, 0.6),
    diffuse: 0.7,
    specular: 0.2
  })

  const s2 = Sphere.create({
    transform: Matrix.scaling(0.5, 0.5, 0.5)
  })

  const w = World.default
  t.deepEqual(w.light, light)
  t.deepEqual(w[0], s1)
  t.deepEqual(w[1], s2)
})

test("intersect a world with a ray", t => {
  const world = World.default
  const ray = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const xs = world.intersect(ray)
  t.is(xs.length, 4)
  t.is(xs[0].t, 4)
  t.is(xs[1].t, 4.5)
  t.is(xs[2].t, 5.5)
  t.is(xs[3].t, 6)
})

test("shading an intersection", t => {
  const world = World.default
  const ray = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const shape = world[0]
  const hit = new Intersection(4, shape)
  hit.prepare(ray)
  const color = world.shade(hit)
  t.deepEqual(color.fixed, Color.of(0.38066, 0.47583, 0.2855))
})

test("shading an intersection from the inside", t => {
  const world = World.default
  world.light = new PointLight(Point(0, 0.25, 0), Color.of(1, 1, 1))
  const ray = new Ray(Point(0, 0, 0), Vector(0, 0, 1))
  const shape = world[1]
  const hit = new Intersection(0.5, shape)
  hit.prepare(ray)
  const color = world.shade(hit)
  t.deepEqual(color.fixed, Color.of(0.90498, 0.90498, 0.90498))
})

test("the color when a ray misses", t => {
  const world = World.default
  const ray = new Ray(Point(0, 0, -5), Vector(0, 1, 0))
  const color = world.colorAt(ray)
  t.deepEqual(color.fixed, Color.of(0, 0, 0))
})

test("the color when a ray hits", t => {
  const world = World.default
  const ray = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const color = world.colorAt(ray)
  t.deepEqual(color.fixed, Color.of(0.38066, 0.47583, 0.2855))
})

test("there is no shadow when nothing is colinear with point and light", t => {
  const world = World.default
  const point = Point(0, 10, 0)
  t.is(world.isShadowed(point), false)
})

test("shadow when an object is between the point and the light", t => {
  const world = World.default
  const point = Point(10, -10, 10)
  t.is(world.isShadowed(point), true)
})

test("there is no shadow when an object is behind the light", t => {
  const world = World.default
  const point = Point(-20, 20, -20)
  t.is(world.isShadowed(point), false)
})

test("there is no shadow when an object is behind the point", t => {
  const world = World.default
  const point = Point(-2, 2, -2)
  t.is(world.isShadowed(point), false)
})
