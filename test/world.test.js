import test from "ava"
import { World, PointLight, Point, Vector, Color, Sphere, Plane, Matrix, Ray, Intersections, Intersection, Pattern } from "../src/models"

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

test("shading an intersection in shadow", t => {
  const s1 = Sphere.create()
  const s2 = Sphere.create({ transform: Matrix.translation(0, 0, 10) })

  const world = World.of(s1, s2)
  world.light = new PointLight(Point(0, 0, -10), Color.of(1, 1, 1))

  const ray = new Ray(Point(0, 0, 5), Vector(0, 0, 1))
  const hit = new Intersection(4, s2)
  hit.prepare(ray)

  const color = world.shade(hit)
  t.deepEqual(color.fixed, Color.of(0.1, 0.1, 0.1))
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

test("reflected color for non-reflective material", t => {
  const world = World.default
  const ray = new Ray(Point(0, 0, 0), Vector(0, 0, 1))
  const shape = world[1]
  shape.material.ambient = 1
  const hit = new Intersection(1, shape)
  hit.prepare(ray)
  const color = world.reflect(hit)
  t.deepEqual(color, Color.of(0, 0, 0))
})

test("reflected color for reflective material", t => {
  const world = World.default
  const shape = Plane.create({
    reflective: 0.5,
    transform: Matrix.translation(0, -1, 0)
  })
  const ray = new Ray(Point(0, 0, -3), Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2))
  const hit = new Intersection(Math.sqrt(2), shape)
  hit.prepare(ray)
  const color = world.reflect(hit)
  t.deepEqual(color.fixed, Color.of(0.19033, 0.23791, 0.14275))
})

test("reflected color at maximum rescursive depth", t => {
  const world = World.default
  const shape = Plane.create({
    reflective: 0.5,
    transform: Matrix.translation(0, -1, 0)
  })
  const ray = new Ray(Point(0, 0, -3), Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2))
  const hit = new Intersection(Math.sqrt(2), shape)
  hit.prepare(ray)
  const color = world.reflect(hit, 0)
  t.deepEqual(color, Color.of(0, 0, 0))
})

test("refracted color with opaque surface", t => {
  const world = World.default
  const ray = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const xs = Intersections.of(
    new Intersection(4, world[0]),
    new Intersection(6, world[0]),
  )
  xs[0].prepare(ray, xs)
  const color = world.refract(xs[0])
  t.deepEqual(color.fixed, Color.of(0, 0, 0))
})

test("refracted color at maximum rescursive depth", t => {
  const world = World.default
  world[0].material.transparency = 1.0
  world[0].material.refractive = 1.5
  const ray = new Ray(Point(0, 0, Math.sqrt(2) / 2), Vector(0, 1, 0))
  const xs = Intersections.of(
    new Intersection(-Math.sqrt(2) / 2, world[0]),
    new Intersection(-Math.sqrt(2) / 2, world[1]),
  )
  xs[1].prepare(ray, xs)
  const color = world.refract(xs[1], 0)
  t.deepEqual(color, Color.of(0, 0, 0))
})

test("refracted color under total internal reflection", t => {
  const world = World.default
  world[0].material.transparency = 1.0
  world[0].material.refractive = 1.5
  const ray = new Ray(Point(0, 0, -Math.sqrt(2) / 2), Vector(0, 1, 0))
  const xs = Intersections.of(
    new Intersection(-Math.sqrt(2) / 2, world[0]),
    new Intersection(Math.sqrt(2) / 2, world[0]),
  )
  xs[1].prepare(ray, xs)
  const color = world.refract(xs[1])
  t.deepEqual(color, Color.of(0, 0, 0))
})

test("refracted color with refracted ray", t => {
  const world = World.default
  world[0].material.ambient = 1.0
  world[0].material.pattern = new Pattern
  world[1].material.transparency = 1.0
  world[1].material.refractive = 1.5
  const ray = new Ray(Point(0, 0, 0.1), Vector(0, 1, 0))
  const xs = Intersections.of(
    new Intersection(-0.9899, world[0]),
    new Intersection(-0.4899, world[1]),
    new Intersection( 0.4899, world[1]),
    new Intersection( 0.9899, world[0]),
  )
  xs[2].prepare(ray, xs)
  const color = world.refract(xs[2])
  t.deepEqual(color.fixed, Color.of(0, 0.99888, 0.04722))
})

test("shade color for reflective material", t => {
  const world = World.default
  const shape = Plane.create({
    reflective: 0.5,
    transform: Matrix.translation(0, -1, 0)
  })
  const ray = new Ray(Point(0, 0, -3), Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2))
  const hit = new Intersection(Math.sqrt(2), shape)
  hit.prepare(ray)
  const color = world.shade(hit)
  t.deepEqual(color.fixed, Color.of(0.87676, 0.92434, 0.82917))
})

test("shade color with transparent material", t => {
  const world = World.default
  const floor = Plane.create({
    transform: Matrix.translation(0, -1, 0),
    transparency: 0.5,
    refractive: 1.5
  })
  world.push(floor)
  const ball = Sphere.create({
    color: Color.of(1, 0, 0),
    ambient: 0.5,
    transform: Matrix.translation(0, -3.5, -0.5)
  })
  world.push(ball)
  const ray = new Ray(Point(0, 0, -3), Vector(0, -Math.sqrt(2) / 2, Math.sqrt(2) / 2))
  const xs = Intersections.of(
    new Intersection(Math.sqrt(2), floor)
  )
  xs[0].prepare(ray, xs)
  const color = world.shade(xs[0])
  t.deepEqual(color.fixed, Color.of(0.93643, 0.68643, 0.68643))
})

test("colorAt with mutually reflective surfaces", t => {
  const world = World.of(
    Plane.create({
      reflective: 1,
      transform: Matrix.translation(0, -1, 0)
    }),
    Plane.create({
      reflective: 1,
      transform: Matrix.translation(0, 1, 0)
    })
  )
  world.light = new PointLight(Point(-10, 10, -10), Color.WHITE)
  const ray = new Ray(Point(0, 0, 0), Vector(0, 1, 0))
  t.truthy(world.colorAt(ray))
})
