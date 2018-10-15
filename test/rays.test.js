import test from "ava"
import { Ray, Point, Vector, Matrix } from "../src/models"

test("creating and querying a ray", t => {
  const origin = Point(1, 2, 3)
  const direction = Vector(4, 5, 6)
  const r = new Ray(origin, direction)
  t.is(r.origin, origin)
  t.is(r.direction, direction)
})

test("computing a point from a distance", t => {
  const r = new Ray(Point(2, 3, 4), Vector(1, 0, 0))
  t.deepEqual(r.position(0), Point(2, 3, 4))
  t.deepEqual(r.position(1), Point(3, 3, 4))
  t.deepEqual(r.position(-1), Point(1, 3, 4))
  t.deepEqual(r.position(2.5), Point(4.5, 3, 4))
})

test("translating a ray", t => {
  const r = new Ray(Point(1, 2, 3), Vector(0, 1, 0))
  const m = Matrix.translation(3, 4, 5)
  const r2 = r.transform(m)
  t.deepEqual(r2.origin, Point(4, 6, 8))
  t.deepEqual(r2.direction, Vector(0, 1, 0))
})

test("scaling a ray", t => {
  const r = new Ray(Point(1, 2, 3), Vector(0, 1, 0))
  const m = Matrix.scaling(2, 3, 4)
  const r2 = r.transform(m)
  t.deepEqual(r2.origin, Point(2, 6, 12))
  t.deepEqual(r2.direction, Vector(0, 3, 0))
})
