import test from "ava"
import { Ray, Sphere, Position, Matrix } from "../src/models"

test("a ray intersects a sphere at two points", t => {
  const r = new Ray(Position.point(0, 0, -5), Position.vector(0, 0, 1))
  const s = new Sphere
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, 4)
  t.is(xs[1].t, 6)
  t.is(xs[0].object, s)
  t.is(xs[1].object, s)
})

test("a ray intersects a sphere at a tangent", t => {
  const r = new Ray(Position.point(0, 1, -5), Position.vector(0, 0, 1))
  const s = new Sphere
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, 5)
  t.is(xs[1].t, 5)
  t.is(xs[0].object, s)
  t.is(xs[1].object, s)
})

test("a ray intersects misses a sphere", t => {
  const r = new Ray(Position.point(0, 2, -5), Position.vector(0, 0, 1))
  const s = new Sphere
  const xs = r.intersect(s)
  t.is(xs.length, 0)
})

test("a ray originates inside a sphere", t => {
  const r = new Ray(Position.point(0, 0, 0), Position.vector(0, 0, 1))
  const s = new Sphere
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, -1)
  t.is(xs[1].t, 1)
  t.is(xs[0].object, s)
  t.is(xs[1].object, s)
})

test("a sphere is behind a ray", t => {
  const r = new Ray(Position.point(0, 0, 5), Position.vector(0, 0, 1))
  const s = new Sphere
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, -6)
  t.is(xs[1].t, -4)
  t.is(xs[0].object, s)
  t.is(xs[1].object, s)
})

test("a sphere's default transformation", t => {
  const s = new Sphere
  t.deepEqual(s.transform, Matrix.identity)
})

test("changing a sphere's transformation", t => {
  const s = new Sphere
  const translation = Matrix.translation(2, 3, 4)
  s.transform = translation
  t.deepEqual(s.transform, translation)
})

test("intersecting a scaled sphere with a ray", t => {
  const r = new Ray(Position.point(0, 0, -5), Position.vector(0, 0, 1))
  const s = new Sphere
  s.transform = Matrix.scaling(2, 2, 2)
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, 3)
  t.is(xs[1].t, 7)
})

test("intersecting a translated sphere with a ray", t => {
  const r = new Ray(Position.point(0, 0, -5), Position.vector(0, 0, 1))
  const s = new Sphere
  s.transform = Matrix.translation(5, 0, 0)
  const xs = r.intersect(s)
  t.is(xs.length, 0)
})
