import test from "ava"
import { Ray, Position, Matrix } from "../src/models"

test("creating and querying a ray", t => {
  const origin = Position.point(1, 2, 3)
  const direction = Position.vector(4, 5, 6)
  const r = new Ray(origin, direction)
  t.is(r.origin, origin)
  t.is(r.direction, direction)
})

test("computing a point from a distance", t => {
  const r = new Ray(Position.point(2, 3, 4), Position.vector(1, 0, 0))
  t.deepEqual(r.position(0), Position.point(2, 3, 4))
  t.deepEqual(r.position(1), Position.point(3, 3, 4))
  t.deepEqual(r.position(-1), Position.point(1, 3, 4))
  t.deepEqual(r.position(2.5), Position.point(4.5, 3, 4))
})

test("translating a ray", t => {
  const r = new Ray(Position.point(1, 2, 3), Position.vector(0, 1, 0))
  const m = Matrix.translation(3, 4, 5)
  const r2 = r.transform(m)
  t.deepEqual(r2.origin, Position.point(4, 6, 8))
  t.deepEqual(r2.direction, Position.vector(0, 1, 0))
})

test("scaling a ray", t => {
  const r = new Ray(Position.point(1, 2, 3), Position.vector(0, 1, 0))
  const m = Matrix.scaling(2, 3, 4)
  const r2 = r.transform(m)
  t.deepEqual(r2.origin, Position.point(2, 6, 12))
  t.deepEqual(r2.direction, Position.vector(0, 3, 0))
})
