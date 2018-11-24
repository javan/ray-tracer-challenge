import test from "ava"
import { Material, Color, Point, Vector, PointLight, Stripe } from "../src/models"

test("the default material", t => {
  const m = Material.create()
  t.deepEqual(m.color, Color.of(1, 1, 1))
  t.is(m.ambient, 0.1)
  t.is(m.diffuse, 0.9)
  t.is(m.specular, 0.9)
  t.is(m.shininess, 200)
  t.is(m.reflective, 0.0)
  t.is(m.transparency, 0.0)
  t.is(m.refractive, 1.0)
})

test("lighting with the eye between the light and the surface", t => {
  const m = Material.create()
  const point = Point(0, 0, 0)

  const eyev = Vector(0, 0, -1)
  const normalv = Vector(0, 0, -1)
  const light = new PointLight(Point(0, 0, -10), Color.of(1, 1, 1))

  const result = m.lighting({ light, point, eyev, normalv })
  t.deepEqual(result.fixed, Color.of(1.9, 1.9, 1.9))
})

test("lighting with the eye between light and surface, eye offset 45°", t => {
  const m = Material.create()
  const point = Point(0, 0, 0)

  const eyev = Vector(0, Math.SQRT2 / 2, -Math.SQRT2 / 2)
  const normalv = Vector(0, 0, -1)
  const light = new PointLight(Point(0, 0, -10), Color.of(1, 1, 1))

  const result = m.lighting({ light, point, eyev, normalv })
  t.deepEqual(result.fixed, Color.of(1.0, 1.0, 1.0))
})

test("lighting with eye opposite surface, light offset 45°", t => {
  const m = Material.create()
  const point = Point(0, 0, 0)

  const eyev = Vector(0, 0, -1)
  const normalv = Vector(0, 0, -1)
  const light = new PointLight(Point(0, 10, -10), Color.of(1, 1, 1))

  const result = m.lighting({ light, point, eyev, normalv })
  t.deepEqual(result.fixed, Color.of(0.7364, 0.7364, 0.7364))
})

test("lighting with eye in the path of the reflection vector", t => {
  const m = Material.create()
  const point = Point(0, 0, 0)

  const eyev = Vector(0, -Math.SQRT2 / 2, -Math.SQRT2 / 2)
  const normalv = Vector(0, 0, -1)
  const light = new PointLight(Point(0, 10, -10), Color.of(1, 1, 1))

  const result = m.lighting({ light, point, eyev, normalv })
  t.deepEqual(result.fixed, Color.of(1.6364, 1.6364, 1.6364))
})

test("lighting with the light behind the surface", t => {
  const m = Material.create()
  const point = Point(0, 0, 0)

  const eyev = Vector(0, 0, -1)
  const normalv = Vector(0, 0, -1)
  const light = new PointLight(Point(0, 0, 10), Color.of(1, 1, 1))

  const result = m.lighting({ light, point, eyev, normalv })
  t.deepEqual(result, Color.of(0.1, 0.1, 0.1))
})

test("lighting with the the surface in shadow", t => {
  const m = Material.create()
  const point = Point(0, 0, 0)

  const eyev = Vector(0, 0, -1)
  const normalv = Vector(0, 0, -1)
  const light = new PointLight(Point(0, 0, -10), Color.of(1, 1, 1))
  const shadowed = true

  const result = m.lighting({ light, point, eyev, normalv, shadowed })
  t.deepEqual(result, Color.of(0.1, 0.1, 0.1))
})

test("lighting with a pattern applied", t => {
  const pattern = Stripe.of(Color.WHITE, Color.BLACK)
  const m = Material.create({ pattern, ambient: 1, diffuse: 0, specular: 0 })

  const eyev = Vector(0, 0, -1)
  const normalv = Vector(0, 0, -1)
  const light = new PointLight(Point(0, 0, -10), Color.of(1, 1, 1))
  const shadowed = false

  const c1 = m.lighting({ point: Point(0.9, 0, 0), light, eyev, normalv, shadowed })
  const c2 = m.lighting({ point: Point(1.1, 0, 0), light, eyev, normalv, shadowed })

  t.deepEqual(c1, Color.WHITE)
  t.deepEqual(c2, Color.BLACK)
})
