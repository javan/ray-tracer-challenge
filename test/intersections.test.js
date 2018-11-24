import test from "ava"
import { Intersection, Intersections, Sphere, Ray, Point, Vector, Matrix } from "../src/models"

test("an intersection encapsulates `t` and `object`", t => {
  const s = Sphere.create()
  const i = new Intersection(3.5, s)
  t.is(i.t, 3.5)
  t.is(i.object, s)
})

test("aggregating intersections", t => {
  const s = Sphere.create()
  const i1 = new Intersection(1, s)
  const i2 = new Intersection(2, s)
  const xs = Intersections.of(i1, i2)
  t.is(xs.length, 2)
  t.is(xs[0], i1)
  t.is(xs[1], i2)
})

test("the hit, when all intersections have positive t", t => {
  const s = Sphere.create()
  const i1 = new Intersection(1, s)
  const i2 = new Intersection(2, s)
  const xs = Intersections.of(i1, i2)
  t.is(xs.hit, i1)
})

test("the hit, when some intersections have negative t", t => {
  const s = Sphere.create()
  const i1 = new Intersection(-1, s)
  const i2 = new Intersection(1, s)
  const xs = Intersections.of(i1, i2)
  t.is(xs.hit, i2)
})

test("the hit, when all intersections have negative t", t => {
  const s = Sphere.create()
  const i1 = new Intersection(-2, s)
  const i2 = new Intersection(-1, s)
  const xs = Intersections.of(i1, i2)
  t.is(xs.hit, undefined)
})

test("the hit is always the lowest non-negative intersection", t => {
  const s = Sphere.create()
  const i1 = new Intersection(6, s)
  const i2 = new Intersection(7, s)
  const i3 = new Intersection(-3, s)
  const i4 = new Intersection(2, s)
  const xs = Intersections.of(i1, i2, i3, i4)
  t.is(xs.hit, i4)
})

test("precomputing the state of an intersection", t => {
  const ray = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const shape = Sphere.create()
  const hit = new Intersection(4, shape)
  hit.prepare(ray)
  t.deepEqual(hit.point.fixed, Point(0, 0, -1))
  t.deepEqual(hit.eyev, ray.direction.negate)
  t.deepEqual(hit.normalv, hit.object.normalAt(hit.point))
})

test("precomputing the reflection vector", t => {
  const ray = new Ray(Point(0, 0, -1), Vector(0, -Math.SQRT2 / 2, Math.SQRT2 / 2))
  const shape = Sphere.create()
  const hit = new Intersection(Math.SQRT2, shape)
  hit.prepare(ray)
  t.deepEqual(hit.reflectv.fixed, Vector(0, Math.SQRT2 / 2, Math.SQRT2 / 2).fixed)
})

test("an intersection occurs on the outside", t => {
  const ray = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const shape = Sphere.create()
  const hit = new Intersection(4, shape)
  hit.prepare(ray)
  t.is(hit.inside, false)
})

test("an intersection occurs on the inside", t => {
  const ray = new Ray(Point(0, 0, 0), Vector(0, 0, 1))
  const shape = Sphere.create()
  const hit = new Intersection(1, shape)
  hit.prepare(ray)
  t.deepEqual(hit.point.fixed, Point(0, 0, 1))
  t.deepEqual(hit.eyev, Vector(0, 0, -1))
  t.deepEqual(hit.normalv, Vector(0, 0, -1))
  t.is(hit.inside, true)
})

test("the point is offset", t => {
  const ray = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const shape = Sphere.create()
  const hit = new Intersection(4, shape)
  hit.prepare(ray)
  const { z } = hit.point
  t.true(z > -1.1 && z < -1, `hit.point.z (${z}) is not between -1.1 and -1 (exclusive)`)
})

test("the under point is offset below the surface", t => {
  const ray = new Ray(Point(0, 0, -5), Vector(0, 0, 1))
  const shape = Sphere.glass()
  const hit = new Intersection(4, shape)
  const xs = Intersections.of(hit)
  hit.prepare(ray, xs)
  const { z } = hit.underPoint
  t.true(z > -1 && z < -0.9, `hit.underPoint.z (${z}) is not between -1 and -0.9 (exclusive)`)
})

test("n1 and n2 at various intersectionst", t => {
  const a = Sphere.glass({ transform: Matrix.scaling(2, 2, 2),         refractive: 1.5 })
  const b = Sphere.glass({ transform: Matrix.translation(0, 0, -0.25), refractive: 2.0 })
  const c = Sphere.glass({ transform: Matrix.translation(0, 0, 0.25),  refractive: 2.5 })

  const xs = Intersections.of(
    new Intersection(2,    a),
    new Intersection(2.75, b),
    new Intersection(3.25, c),
    new Intersection(4.75, b),
    new Intersection(5.25, c),
    new Intersection(6,    a),
  )

  const ray = new Ray(Point(0, 0, -4), Vector(0, 0, 1))
  xs.forEach(x => x.prepare(ray, xs))

  t.is(xs[0].n1, 1.0)
  t.is(xs[0].n2, 1.5)
  t.is(xs[1].n1, 1.5)
  t.is(xs[1].n2, 2.0)
  t.is(xs[2].n1, 2.0)
  t.is(xs[2].n2, 2.5)
  t.is(xs[3].n1, 2.5)
  t.is(xs[3].n2, 2.5)
  t.is(xs[4].n1, 2.5)
  t.is(xs[4].n2, 1.5)
  t.is(xs[5].n1, 1.5)
  t.is(xs[5].n2, 1.0)
})

test("schlick approximation under total internal reflection", t => {
  const shape = Sphere.glass()
  const ray = new Ray(Point(0, 0, -Math.SQRT2 / 2), Vector(0, 1, 0))
  const xs = Intersections.of(
    new Intersection(-Math.SQRT2 / 2, shape),
    new Intersection( Math.SQRT2 / 2, shape),
  )
  xs[1].prepare(ray, xs)
  t.is(xs[1].schlick, 1.0)
})

test("schlick approximation with a perpendicular viewing angle", t => {
  const shape = Sphere.glass()
  const ray = new Ray(Point(0, 0, 0), Vector(0, 1, 0))
  const xs = Intersections.of(
    new Intersection(-1, shape),
    new Intersection( 1, shape),
  )
  xs[1].prepare(ray, xs)
  t.is(Number(xs[1].schlick.toFixed(2)), 0.04)
})

test("schlick approximation with small angle and n2 > n1", t => {
  const shape = Sphere.glass()
  const ray = new Ray(Point(0, 0.99, -2), Vector(0, 0, 1))
  const xs = Intersections.of(
    new Intersection(1.8589, shape),
  )
  xs[0].prepare(ray, xs)
  t.is(Number(xs[0].schlick.toFixed(5)), 0.48873)
})
