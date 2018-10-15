import test from "ava"
import { Intersection, Intersections, Sphere, Ray, Position } from "../src/models"

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
  const ray = new Ray(Position.point(0, 0, -5), Position.vector(0, 0, 1))
  const shape = Sphere.create()
  const hit = new Intersection(4, shape)
  hit.prepare(ray)
  t.deepEqual(hit.point, Position.point(0, 0, -1))
  t.deepEqual(hit.eyev, ray.direction.negate)
  t.deepEqual(hit.normalv, hit.object.normalAt(hit.point))
})

test("an intersection occurs on the outside", t => {
  const ray = new Ray(Position.point(0, 0, -5), Position.vector(0, 0, 1))
  const shape = Sphere.create()
  const hit = new Intersection(4, shape)
  hit.prepare(ray)
  t.is(hit.inside, false)
})

test("an intersection occurs on the inside", t => {
  const ray = new Ray(Position.point(0, 0, 0), Position.vector(0, 0, 1))
  const shape = Sphere.create()
  const hit = new Intersection(1, shape)
  hit.prepare(ray)
  t.deepEqual(hit.point, Position.point(0, 0, 1))
  t.deepEqual(hit.eyev, Position.vector(0, 0, -1))
  t.deepEqual(hit.normalv, Position.vector(0, 0, -1))
  t.is(hit.inside, true)
})
