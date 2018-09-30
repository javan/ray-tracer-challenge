import test from "ava"
import { Intersection, Intersections, Sphere } from "../src/models"

test("an intersection encapsulates `t` and `object`", t => {
  const s = new Sphere
  const i = new Intersection(3.5, s)
  t.is(i.t, 3.5)
  t.is(i.object, s)
})

test("aggregating intersections", t => {
  const s = new Sphere
  const i1 = new Intersection(1, s)
  const i2 = new Intersection(2, s)
  const xs = Intersections.of(i1, i2)
  t.is(xs.length, 2)
  t.is(xs[0], i1)
  t.is(xs[1], i2)
})

test("the hit, when all intersections have positive t", t => {
  const s = new Sphere
  const i1 = new Intersection(1, s)
  const i2 = new Intersection(2, s)
  const xs = Intersections.of(i1, i2)
  t.is(xs.hit, i1)
})

test("the hit, when some intersections have negative t", t => {
  const s = new Sphere
  const i1 = new Intersection(-1, s)
  const i2 = new Intersection(1, s)
  const xs = Intersections.of(i1, i2)
  t.is(xs.hit, i2)
})

test("the hit, when all intersections have negative t", t => {
  const s = new Sphere
  const i1 = new Intersection(-2, s)
  const i2 = new Intersection(-1, s)
  const xs = Intersections.of(i1, i2)
  t.is(xs.hit, undefined)
})

test("the hit is always the lowest non-negative intersection", t => {
  const s = new Sphere
  const i1 = new Intersection(6, s)
  const i2 = new Intersection(7, s)
  const i3 = new Intersection(-3, s)
  const i4 = new Intersection(2, s)
  const xs = Intersections.of(i1, i2, i3, i4)
  t.is(xs.hit, i4)
})
