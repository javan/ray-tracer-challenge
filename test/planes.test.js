import test from "ava"
import { Plane, Point, Vector, Ray } from "../src/models"

test("the normal of a plane is constant everywhere", t => {
  const p = Plane.create()
  const n1 = p.normalAt(Point(0, 0, 0))
  const n2 = p.normalAt(Point(10, 0, -10))
  const n3 = p.normalAt(Point(-5, 0, 150))
  t.deepEqual(n1.fixed, Vector(0, 1, 0))
  t.deepEqual(n2.fixed, Vector(0, 1, 0))
  t.deepEqual(n3.fixed, Vector(0, 1, 0))
})

test("intersect with a ray parallel to the plane", t => {
  const p = Plane.create()
  const r = new Ray(Point(0, 10, 0), Vector(0, 0, 1))
  const xs = r.intersect(p)
  t.is(xs.length, 0)
})

test("intersect with a coplanar ray", t => {
  const p = Plane.create()
  const r = new Ray(Point(0, 0, 0), Vector(0, 0, 1))
  const xs = r.intersect(p)
  t.is(xs.length, 0)
})

test("a ray intersecting a plane from above", t => {
  const p = Plane.create()
  const r = new Ray(Point(0, 1, 0), Vector(0, -1, 0))
  const xs = r.intersect(p)
  t.is(xs.length, 1)
  t.is(xs[0].t, 1)
  t.is(xs[0].object, p)
})

test("a ray intersecting a plane from below", t => {
  const p = Plane.create()
  const r = new Ray(Point(0, -1, 0), Vector(0, 1, 0))
  const xs = r.intersect(p)
  t.is(xs.length, 1)
  t.is(xs[0].t, 1)
  t.is(xs[0].object, p)
})
