import test from "ava"
import { Matrix, Point, Vector } from "../src/models"

test("multiplying by a translation matrix", t => {
  const transform = Matrix.translation(5, -3, 2)
  const point = Point(-3, 4, 5)
  t.deepEqual(transform.multiplyBy(point), Point(2, 1, 7))
})

test("multiplying by the inverse of a translation matrix", t => {
  const transform = Matrix.translation(5, -3, 2)
  const point = Point(-3, 4, 5)
  t.deepEqual(transform.inverse.multiplyBy(point), Point(-8, 7, 3))
})

test("translation does not affect vectors", t => {
  const transform = Matrix.translation(5, -3, 2)
  const vector = Vector(-3, 4, 5)
  t.deepEqual(transform.multiplyBy(vector), vector)
})

test("a scaling matrix applied to a point", t => {
  const transform = Matrix.scaling(2, 3, 4)
  const point = Point(-4, 6, 8)
  t.deepEqual(transform.multiplyBy(point), Point(-8, 18, 32))
})

test("a scaling matrix applied to a vector", t => {
  const transform = Matrix.scaling(2, 3, 4)
  const vector = Vector(-4, 6, 8)
  t.deepEqual(transform.multiplyBy(vector), Vector(-8, 18, 32))
})

test("multiplying by the inverse of a scaling matrix", t => {
  const transform = Matrix.scaling(2, 3, 4)
  const vector = Vector(-4, 6, 8)
  t.deepEqual(transform.inverse.multiplyBy(vector), Vector(-2, 2, 2))
})

test("reflection is scaling by a negative value", t => {
  const transform = Matrix.scaling(-1, 1, 1)
  const point = Point(2, 3, 4)
  t.deepEqual(transform.multiplyBy(point), Point(-2, 3, 4))
})

test("rotating a point around the x axis", t => {
  const point = Point(0, 1, 0)
  const halfQuarter = Matrix.rotationX(Math.PI / 4)
  const fullQuarter = Matrix.rotationX(Math.PI / 2)
  t.deepEqual(halfQuarter.multiplyBy(point).fixed, Point(0, Math.SQRT2 / 2, Math.SQRT2 / 2).fixed)
  t.deepEqual(fullQuarter.multiplyBy(point).fixed, Point(0, 0, 1).fixed)
})

test("the inverse of an x-rotation rotates in the opposite direction", t => {
  const point = Point(0, 1, 0 )
  const halfQuarter = Matrix.rotationX(Math.PI / 4)
  t.deepEqual(halfQuarter.inverse.multiplyBy(point).fixed, Point(0, Math.SQRT2 / 2, -Math.SQRT2 / 2).fixed)
})

test("rotating a point around the y axis", t => {
  const point = Point(0, 0, 1)
  const halfQuarter = Matrix.rotationY(Math.PI / 4)
  const fullQuarter = Matrix.rotationY(Math.PI / 2)
  t.deepEqual(halfQuarter.multiplyBy(point).fixed, Point(Math.SQRT2 / 2, 0, Math.SQRT2 / 2).fixed)
  t.deepEqual(fullQuarter.multiplyBy(point).fixed, Point(1, 0, 0).fixed)
})

test("rotating a point around the z axis", t => {
  const point = Point(0, 1, 0)
  const halfQuarter = Matrix.rotationZ(Math.PI / 4)
  const fullQuarter = Matrix.rotationZ(Math.PI / 2)
  t.deepEqual(halfQuarter.multiplyBy(point).fixed, Point(-Math.SQRT2 / 2, Math.SQRT2 / 2, 0).fixed)
  t.deepEqual(fullQuarter.multiplyBy(point).fixed, Point(-1, 0, 0).fixed)
})

test("shearing transformation moves x in proportion to z", t => {
  const transform = Matrix.shearing(0, 1, 0, 0, 0, 0)
  const point = Point(2, 3, 4)
  t.deepEqual(transform.multiplyBy(point), Point(6, 3, 4))
})

test("shearing transformation moves y in proportion to x", t => {
  const transform = Matrix.shearing(0, 0, 1, 0, 0, 0)
  const point = Point(2, 3, 4)
  t.deepEqual(transform.multiplyBy(point), Point(2, 5, 4))
})

test("shearing transformation moves y in proportion to z", t => {
  const transform = Matrix.shearing(0, 0, 0, 1, 0, 0)
  const point = Point(2, 3, 4)
  t.deepEqual(transform.multiplyBy(point), Point(2, 7, 4))
})

test("shearing transformation moves z in proportion to x", t => {
  const transform = Matrix.shearing(0, 0, 0, 0, 1, 0)
  const point = Point(2, 3, 4)
  t.deepEqual(transform.multiplyBy(point), Point(2, 3, 6))
})

test("shearing transformation moves z in proportion to y", t => {
  const transform = Matrix.shearing(0, 0, 0, 0, 0, 1)
  const point = Point(2, 3, 4)
  t.deepEqual(transform.multiplyBy(point), Point(2, 3, 7))
})

test("individual transformations are applied in sequence", t => {
  const p = Point(1, 0, 1)
  const A = Matrix.rotationX(Math.PI / 2)
  const B = Matrix.scaling(5, 5, 5)
  const C = Matrix.translation(10, 5, 7)

  // apply rotation first
  const p2 = A.multiplyBy(p)
  t.deepEqual(p2.fixed, Point(1, -1, 0).fixed)

  // then apply scaling
  const p3 = B.multiplyBy(p2)
  t.deepEqual(p3.fixed, Point(5, -5, 0).fixed)

  // then apply translation
  const p4 = C.multiplyBy(p3)
  t.deepEqual(p4.fixed, Point(15, 0, 7).fixed)
})

test("chained transformations must be applied in reverse order", t => {
  const p = Point(1, 0, 1)
  const A = Matrix.rotationX(Math.PI / 2)
  const B = Matrix.scaling(5, 5, 5)
  const C = Matrix.translation(10, 5, 7)

  const T = C.multiplyBy(B).multiplyBy(A)
  t.deepEqual(T.multiplyBy(p).fixed, Point(15, 0, 7).fixed)
})

test("chained transformations", t => {
  const p = Point(1, 0, 1)

  const A = Matrix.rotationX(Math.PI / 2)
  const B = Matrix.scaling(5, 5, 5)
  const C = Matrix.translation(10, 5, 7)
  const T = C.multiplyBy(B).multiplyBy(A)

  t.deepEqual(Matrix.transform({
    rotate: { x: 90 },
     scale: { x: 5,  y: 5, z: 5 },
      move: { x: 10, y: 5, z: 7 },
  }), T)

  t.deepEqual(Matrix.transform({
    rotate: { x: 90 },
     scale: 5,
      move: { x: 10, y: 5, z: 7 },
  }), T)
})
