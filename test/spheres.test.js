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

test("a sphere's default transformation", t => {
  const s = Sphere.create()
  t.deepEqual(s.transform, Matrix.identity)
})

test("changing a sphere's transformation", t => {
  const transform = Matrix.translation(2, 3, 4)
  const s = Sphere.create({ transform })
  t.deepEqual(s.transform, transform)
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

test("computing the normal on a translated sphere", t => {
  const s = Sphere.create({ transform: Matrix.translation(0, 1, 0) })
  const n = s.normalAt(Point(0, 1.70711, -0.70711))
  t.deepEqual(n.fixed, Vector(0, 0.70711, -0.70711))
})

test("computing the normal on a scaled sphere", t => {
  const s = Sphere.create({ transform: Matrix.scaling(1, 0.5, 1) })
  const n = s.normalAt(Point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2))
  t.deepEqual(n.fixed, Vector(0, 0.97014, -0.24254))
})

test("a sphere has a default material", t => {
  const s = Sphere.create()
  t.deepEqual(s.material, Material.create())
})

test("a sphere may be assigned a material", t => {
  const s = Sphere.create({ ambient: 1 })
  const m = Material.create({ ambient: 1 })
  t.deepEqual(s.material, m)
})
