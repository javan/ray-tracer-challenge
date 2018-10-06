import test from "ava"
import { Tuple, Position, Color } from "../src/models"

test("position with w=1.0 is a point", t => {
  const a = Position.of(4.3, -4.2, 3.1, 1.0)
  t.is(a.x, 4.3)
  t.is(a.y, -4.2)
  t.is(a.z, 3.1)
  t.is(a.w, 1.0)
  t.is(a.isPoint, true)
  t.is(a.isVector, false)
})

test("position with w=0 is a vector", t => {
  const a = Position.of(4.3, -4.2, 3.1, 0.0)
  t.is(a.x, 4.3)
  t.is(a.y, -4.2)
  t.is(a.z, 3.1)
  t.is(a.w, 0.0)
  t.is(a.isPoint, false)
  t.is(a.isVector, true)
})

test("point describes positions with w=1", t => {
  t.deepEqual(Position.point(4, -4, 3), Position.of(4, -4, 3, 1))
})

test("vector describes positions with w=0", t => {
  t.deepEqual(Position.vector(4, -4, 3), Position.of(4, -4, 3, 0))
})

test("adding two tuples", t => {
  const a1 = Tuple.of(3, -2, 5, 1)
  const a2 = Tuple.of(-2, 3, 1, 0)
  t.deepEqual(a1.add(a2), Tuple.of(1, 1, 6, 1))
})

test("subtracting two points", t => {
  const p1 = Position.point(3, 2, 1)
  const p2 = Position.point(5, 6, 7)
  t.deepEqual(p1.subtract(p2), Position.vector(-2, -4, -6))
})

test("subtracting a vector from a point", t => {
  const p = Position.point(3, 2, 1)
  const v = Position.vector(5, 6, 7)
  t.deepEqual(p.subtract(v), Position.point(-2, -4, -6))
})

test("subtracting two vectors", t => {
  const v1 = Position.vector(3, 2, 1)
  const v2 = Position.vector(5, 6, 7)
  t.deepEqual(v1.subtract(v2), Position.vector(-2, -4, -6))
})

test("subtracting a vector from the zero vectors", t => {
  const zero = Position.vector(0, 0, 0)
  const v = Position.vector(1, -2, 3)
  t.deepEqual(zero.subtract(v), Position.vector(-1, 2, -3))
})

test("negating a tuple", t => {
  const a = Tuple.of(1, -2, 3, -4)
  t.deepEqual(a.negate, Tuple.of(-1, 2, -3, 4))
})

test("multiplying a tuple by a scalar", t => {
  const a = Tuple.of(1, -2, 3, -4)
  t.deepEqual(a.multiplyBy(3.5), Tuple.of(3.5, -7, 10.5, -14))
})

test("multiplying a tuple by a fraction", t => {
  const a = Tuple.of(1, -2, 3, -4)
  t.deepEqual(a.multiplyBy(0.5), Tuple.of(0.5, -1, 1.5, -2))
})

test("dividing a tuple by a scalar", t => {
  const a = Tuple.of(1, -2, 3, -4)
  t.deepEqual(a.divideBy(2), Tuple.of(0.5, -1, 1.5, -2))
})

test("magnitude of Position.vector(1, 0, 0)", t => {
  const v = Position.vector(1, 0, 0)
  t.is(v.magnitude, 1)
})

test("magnitude of Position.vector(0, 1, 0)", t => {
  const v = Position.vector(0, 1, 0)
  t.is(v.magnitude, 1)
})

test("magnitude of Position.vector(0, 0, 1)", t => {
  const v = Position.vector(0, 0, 1)
  t.is(v.magnitude, 1)
})

test("magnitude of Position.vector(1, 2, 3)", t => {
  const v = Position.vector(1, 2, 3)
  t.is(v.magnitude, Math.sqrt(14))
})

test("magnitude of Position.vector(-1, -2, -3)", t => {
  const v = Position.vector(-1, -2, -3)
  t.is(v.magnitude, Math.sqrt(14))
})

test("normalizing Position.vector(4, 0, 0) gives (1, 0, 0)", t => {
  const v = Position.vector(4, 0, 0)
  t.deepEqual(v.normalize, Position.vector(1, 0, 0))
})

test("normalizing Position.vector(1, 2, 3)", t => {
  const v = Position.vector(1, 2, 3)
  t.deepEqual(v.normalize, Position.vector(1 / Math.sqrt(14), 2 / Math.sqrt(14), 3 / Math.sqrt(14)))
})

test("magnitude of a normalized vector", t => {
  const v = Position.vector(1, 2, 3)
  t.is(v.normalize.magnitude, 1)
})

test("dot product of two tuples", t => {
  const a = Position.vector(1, 2, 3)
  const b = Position.vector(2, 3, 4)
  t.is(a.dotProduct(b), 20)
})

test("cross product of two vectors", t => {
  const a = Position.vector(1, 2, 3)
  const b = Position.vector(2, 3, 4)
  t.deepEqual(a.crossProduct(b), Position.vector(-1, 2, -1))
  t.deepEqual(b.crossProduct(a), Position.vector(1, -2, 1))
})

test("colors are (red, green, blue) tuples", t => {
  const c = Color.of(-0.5, 0.4, 1.7)
  t.is(c.red, -0.5)
  t.is(c.green, 0.4)
  t.is(c.blue, 1.7)
})

test("adding colors", t => {
  const c1 = Color.of(0.9, 0.6, 0.75)
  const c2 = Color.of(0.5, 0.1, 0.25)
  t.deepEqual(c1.add(c2), Color.of(1.4, 0.7, 1.0))
})

test("subtracting colors", t => {
  const c1 = Color.of(0.9, 0.6, 0.75)
  const c2 = Color.of(0.5, 0.1, 0.25)
  t.deepEqual(c1.subtract(c2), Color.of(0.4, 0.5, 0.5))
})

test("multiplying a color by a scalar", t => {
  const c = Color.of(0.2, 0.3, 0.4)
  t.deepEqual(c.multiplyBy(2), Color.of(0.4, 0.6, 0.8))
})

test("multiplying colors", t => {
  const c1 = Color.of(1, 0.2, 0.3)
  const c2 = Color.of(0.9, 1, 0.1)
  t.deepEqual(c1.multiplyBy(c2), Color.of(0.9, 0.2, 0.03))
})

test("reflecting a vector approaching at 45°", t => {
  const v = Position.vector(1, -1, 0)
  const n = Position.vector(0, 1, 0)
  const r = v.reflect(n)
  t.deepEqual(r.fixed, Position.vector(1, 1, 0).fixed)
})

test("reflecting a vector off a slanted surface", t => {
  const v = Position.vector(0, -1, 0)
  const n = Position.vector(Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0)
  const r = v.reflect(n)
  t.deepEqual(r.fixed, Position.vector(1, 0, 0).fixed)
})
