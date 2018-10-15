import test from "ava"
import { Material, Color, Position, PointLight } from "../src/models"

test("the default material", t => {
  const m = Material.create()
  t.deepEqual(m.color, Color.of(1, 1, 1))
  t.is(m.ambient, 0.1)
  t.is(m.diffuse, 0.9)
  t.is(m.specular, 0.9)
  t.is(m.shininess, 200)
})

test("lighting with the eye between the light and the surface", t => {
  const m = Material.create()
  const position = Position.point(0, 0, 0)

  const eyev = Position.vector(0, 0, -1)
  const normalv = Position.vector(0, 0, -1)
  const light = new PointLight(Position.point(0, 0, -10), Color.of(1, 1, 1))

  const result = m.lighting(light, position, eyev, normalv)
  t.deepEqual(result.fixed, Color.of(1.9, 1.9, 1.9))
})

test("lighting with the eye between light and surface, eye offset 45°", t => {
  const m = Material.create()
  const position = Position.point(0, 0, 0)

  const eyev = Position.vector(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2)
  const normalv = Position.vector(0, 0, -1)
  const light = new PointLight(Position.point(0, 0, -10), Color.of(1, 1, 1))

  const result = m.lighting(light, position, eyev, normalv)
  t.deepEqual(result.fixed, Color.of(1.0, 1.0, 1.0))
})

test("lighting with eye opposite surface, light offset 45°", t => {
  const m = Material.create()
  const position = Position.point(0, 0, 0)

  const eyev = Position.vector(0, 0, -1)
  const normalv = Position.vector(0, 0, -1)
  const light = new PointLight(Position.point(0, 10, -10), Color.of(1, 1, 1))

  const result = m.lighting(light, position, eyev, normalv)
  t.deepEqual(result.fixed, Color.of(0.7364, 0.7364, 0.7364))
})

test("lighting with eye in the path of the reflection vector", t => {
  const m = Material.create()
  const position = Position.point(0, 0, 0)

  const eyev = Position.vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2)
  const normalv = Position.vector(0, 0, -1)
  const light = new PointLight(Position.point(0, 10, -10), Color.of(1, 1, 1))

  const result = m.lighting(light, position, eyev, normalv)
  t.deepEqual(result.fixed, Color.of(1.6364, 1.6364, 1.6364))
})

test("lighting with the light behind the surface", t => {
  const m = Material.create()
  const position = Position.point(0, 0, 0)

  const eyev = Position.vector(0, 0, -1)
  const normalv = Position.vector(0, 0, -1)
  const light = new PointLight(Position.point(0, 0, 10), Color.of(1, 1, 1))

  const result = m.lighting(light, position, eyev, normalv)
  t.deepEqual(result, Color.of(0.1, 0.1, 0.1))
})
