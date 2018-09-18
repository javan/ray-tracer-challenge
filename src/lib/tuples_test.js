import test from "ava"
import { tuple, position, point, vector, color } from "./tuples"

test("position with w=1.0 is a point", t => {
  const a = position(4.3, -4.2, 3.1, 1.0)
  t.is(a.x, 4.3)
  t.is(a.y, -4.2)
  t.is(a.z, 3.1)
  t.is(a.w, 1.0)
  t.is(a.isPoint, true)
  t.is(a.isVector, false)
})

test("position with w=0 is a vector", t => {
  const a = position(4.3, -4.2, 3.1, 0.0)
  t.is(a.x, 4.3)
  t.is(a.y, -4.2)
  t.is(a.z, 3.1)
  t.is(a.w, 0.0)
  t.is(a.isPoint, false)
  t.is(a.isVector, true)
})

test("point describes positions with w=1", t => {
  t.deepEqual(point(4, -4, 3), position(4, -4, 3, 1))
})

test("vector describes positions with w=0", t => {
  t.deepEqual(vector(4, -4, 3), position(4, -4, 3, 0))
})

test("adding two tuples", t => {
  const a1 = tuple(3, -2, 5, 1)
  const a2 = tuple(-2, 3, 1, 0)
  t.deepEqual(a1.add(a2), tuple(1, 1, 6, 1))
})

test("subtracting two points", t => {
  const p1 = point(3, 2, 1)
  const p2 = point(5, 6, 7)
  t.deepEqual(p1.subtract(p2), vector(-2, -4, -6))
})

test("subtracting a vector from a point", t => {
  const p = point(3, 2, 1)
  const v = vector(5, 6, 7)
  t.deepEqual(p.subtract(v), point(-2, -4, -6))
})

test("subtracting two vectors", t => {
  const v1 = vector(3, 2, 1)
  const v2 = vector(5, 6, 7)
  t.deepEqual(v1.subtract(v2), vector(-2, -4, -6))
})

test("subtracting a vector from the zero vectors", t => {
  const zero = vector(0, 0, 0)
  const v = vector(1, -2, 3)
  t.deepEqual(zero.subtract(v), vector(-1, 2, -3))
})

test("negating a tuple", t => {
  const a = tuple(1, -2, 3, -4)
  t.deepEqual(a.negate, tuple(-1, 2, -3, 4))
})

test("multiplying a tuple by a scalar", t => {
  const a = tuple(1, -2, 3, -4)
  t.deepEqual(a.multiplyBy(3.5), tuple(3.5, -7, 10.5, -14))
})

test("multiplying a tuple by a fraction", t => {
  const a = tuple(1, -2, 3, -4)
  t.deepEqual(a.multiplyBy(0.5), tuple(0.5, -1, 1.5, -2))
})

test("dividing a tuple by a scalar", t => {
  const a = tuple(1, -2, 3, -4)
  t.deepEqual(a.divideBy(2), tuple(0.5, -1, 1.5, -2))
})

test("magnitude of vector(1, 0, 0)", t => {
  const v = vector(1, 0, 0)
  t.is(v.magnitude, 1)
})

test("magnitude of vector(0, 1, 0)", t => {
  const v = vector(0, 1, 0)
  t.is(v.magnitude, 1)
})

test("magnitude of vector(0, 0, 1)", t => {
  const v = vector(0, 0, 1)
  t.is(v.magnitude, 1)
})

test("magnitude of vector(1, 2, 3)", t => {
  const v = vector(1, 2, 3)
  t.is(v.magnitude, Math.sqrt(14))
})

test("magnitude of vector(-1, -2, -3)", t => {
  const v = vector(-1, -2, -3)
  t.is(v.magnitude, Math.sqrt(14))
})

test("normalizing vector(4, 0, 0) gives (1, 0, 0)", t => {
  const v = vector(4, 0, 0)
  t.deepEqual(v.normalize, vector(1, 0, 0))
})

test("normalizing vector(1, 2, 3)", t => {
  const v = vector(1, 2, 3)
  t.deepEqual(v.normalize, vector(1 / Math.sqrt(14), 2 / Math.sqrt(14), 3 / Math.sqrt(14)))
})

test("magnitude of a normalized vector", t => {
  const v = vector(1, 2, 3)
  t.is(v.normalize.magnitude, 1)
})

test("dot product of two tuples", t => {
  const a = vector(1, 2, 3)
  const b = vector(2, 3, 4)
  t.is(a.dotProduct(b), 20)
})

test("cross product of two vectors", t => {
  const a = vector(1, 2, 3)
  const b = vector(2, 3, 4)
  t.deepEqual(a.crossProduct(b), vector(-1, 2, -1))
  t.deepEqual(b.crossProduct(a), vector(1, -2, 1))
})

test("colors are (red, green, blue) tuples", t => {
  const c = color(-0.5, 0.4, 1.7)
  t.is(c.red, -0.5)
  t.is(c.green, 0.4)
  t.is(c.blue, 1.7)
})

test("adding colors", t => {
  const c1 = color(0.9, 0.6, 0.75)
  const c2 = color(0.5, 0.1, 0.25)
  t.deepEqual(c1.add(c2), color(1.4, 0.7, 1.0))
})

test("subtracting colors", t => {
  const c1 = color(0.9, 0.6, 0.75)
  const c2 = color(0.5, 0.1, 0.25)
  t.deepEqual(c1.subtract(c2), color(0.4, 0.5, 0.5))
})

test("multiplying a color by a scalar", t => {
  const c = color(0.2, 0.3, 0.4)
  t.deepEqual(c.multiplyBy(2), color(0.4, 0.6, 0.8))
})

test("multiplying colors", t => {
  const c1 = color(1, 0.2, 0.3)
  const c2 = color(0.9, 1, 0.1)
  t.deepEqual(c1.multiplyBy(c2), color(0.9, 0.2, 0.03))
})
