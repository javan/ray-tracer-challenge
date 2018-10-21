import test from "ava"
import { Ray, Sphere, Point, Vector, Matrix, Material } from "../src/models"

test("a ray intersects a sphere at two points", t => {
  const r = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const s = Sphere.create()
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, 4)
  t.is(xs[1].t, 6)
  t.is(xs[0].object, s)
  t.is(xs[1].object, s)
})

test("a ray intersects a sphere at a tangent", t => {
  const r = new Ray(Point(0, 1, -5), Vector(0, 0, 1))
  const s = Sphere.create()
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, 5)
  t.is(xs[1].t, 5)
  t.is(xs[0].object, s)
  t.is(xs[1].object, s)
})

test("a ray intersects misses a sphere", t => {
  const r = new Ray(Point(0, 2, -5), Vector(0, 0, 1))
  const s = Sphere.create()
  const xs = r.intersect(s)
  t.is(xs.length, 0)
})

test("a ray originates inside a sphere", t => {
  const r = new Ray(Point(0, 0, 0), Vector(0, 0, 1))
  const s = Sphere.create()
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, -1)
  t.is(xs[1].t, 1)
  t.is(xs[0].object, s)
  t.is(xs[1].object, s)
})

test("a sphere is behind a ray", t => {
  const r = new Ray(Point(0, 0, 5), Vector(0, 0, 1))
  const s = Sphere.create()
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, -6)
  t.is(xs[1].t, -4)
  t.is(xs[0].object, s)
  t.is(xs[1].object, s)
})

test("intersecting a scaled sphere with a ray", t => {
  const r = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const s = Sphere.create({ transform: Matrix.scaling(2, 2, 2) })
  const xs = r.intersect(s)
  t.is(xs.length, 2)
  t.is(xs[0].t, 3)
  t.is(xs[1].t, 7)
})

test("intersecting a translated sphere with a ray", t => {
  const r = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const s = Sphere.create({ transform: Matrix.translation(5, 0, 0) })
  const xs = r.intersect(s)
  t.is(xs.length, 0)
})

test("the normal on a sphere at a point on the x axis", t => {
  const s = Sphere.create()
  const n = s.normalAt(Point(1, 0, 0))
  t.deepEqual(n, Vector(1, 0, 0))
})

test("the normal on a sphere at a point on the y axis", t => {
  const s = Sphere.create()
  const n = s.normalAt(Point(0, 1, 0))
  t.deepEqual(n, Vector(0, 1, 0))
})

test("the normal on a sphere at a point on the z axis", t => {
  const s = Sphere.create()
  const n = s.normalAt(Point(0, 0, 1))
  t.deepEqual(n, Vector(0, 0, 1))
})

test("the normal on a sphere at a non-axial point", t => {
  const s = Sphere.create()
  const n = s.normalAt(Point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3))
  t.deepEqual(n, Vector(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3))
})

test("the normal is a normalized vector", t => {
  const s = Sphere.create()
  const n = s.normalAt(Point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3))
  t.deepEqual(n, n.normalize)
})
