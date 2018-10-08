import test from "ava"
import { Matrix, Tuple } from "../src/models"

test("constructing and inspecting a 4x4 matrix", t => {
  const m = Matrix.of(
    [  1  ,    2,    3,    4 ],
    [  5.5,  6.5,  7.5,  8.5 ],
    [  9  ,   10,   11,   12 ],
    [ 13.5, 14.5, 15.5, 16.5 ],
  )
  t.is(m[0][0], 1)
  t.is(m[0][3], 4)
  t.is(m[1][0], 5.5)
  t.is(m[1][2], 7.5)
  t.is(m[2][2], 11)
  t.is(m[3][0], 13.5)
  t.is(m[3][2], 15.5)
})

test("a 2x2 matrix ought to be representable", t => {
  const m = Matrix.of(
    [ -3,  5 ],
    [  1, -2 ],
  )
  t.is(m[0][0], -3)
  t.is(m[0][1], 5)
  t.is(m[1][0], 1)
  t.is(m[1][1], -2)
})

test("a 3x3 matrix ought to be representable", t => {
  const m = Matrix.of(
    [ -3,  5,  0 ],
    [  1, -2, -7 ],
    [  0,  1,  1 ],
  )
  t.is(m[0][0], -3)
  t.is(m[1][1], -2)
  t.is(m[2][2], 1)
})

test("multiplying two matrices", t => {
  const a = Matrix.of(
    [ 1, 2, 3, 4 ],
    [ 2, 3, 4, 5 ],
    [ 3, 4, 5, 6 ],
    [ 4, 5, 6, 7 ],
  )
  const b = Matrix.of(
    [ 0, 1,  2,  4 ],
    [ 1, 2,  4,  8 ],
    [ 2, 4,  8, 16 ],
    [ 4, 8, 16, 32 ],
  )
  t.deepEqual(a.multiplyBy(b),
    Matrix.of(
      [ 24, 49,  98, 196 ],
      [ 31, 64, 128, 256 ],
      [ 38, 79, 158, 316 ],
      [ 45, 94, 188, 376 ],
    )
  )
})

test("a matrix multiplied by a tuple", t => {
  const a = Matrix.of(
    [ 1, 2, 3, 4 ],
    [ 2, 4, 4, 2 ],
    [ 8, 6, 4, 1 ],
    [ 0, 0, 0, 1 ],
  )
  const b = Tuple.of(1, 2, 3, 1)
  t.deepEqual(a.multiplyBy(b), Tuple.of(18, 24, 33, 1))
})

test("multiplying a matrix by the identity", t => {
  const a = Matrix.of(
    [ 0, 1,  2,  4 ],
    [ 1, 2,  4,  8 ],
    [ 2, 4,  8, 16 ],
    [ 4, 8, 16, 32 ],
  )
  t.deepEqual(a.multiplyBy(Matrix.identity), a)
})

test("multiplying identity by a tuple", t => {
  const a = Tuple.of(1, 2, 3, 4)
  t.deepEqual(Matrix.identity.multiplyBy(a), a)
})

test("transposing a matrix", t => {
  t.deepEqual(
    Matrix.of(
      [ 0, 9, 3, 0 ],
      [ 9, 8, 0, 8 ],
      [ 1, 8, 5, 3 ],
      [ 0, 0, 5, 8 ],
    ).transpose,
    Matrix.of(
      [ 0, 9, 1, 0 ],
      [ 9, 8, 8, 0 ],
      [ 3, 0, 5, 5 ],
      [ 0, 8, 3, 8 ],
    )
  )
})

test("calculating the determinant of a 2x2 matrix", t => {
  const m = Matrix.of(
    [  1, 5 ],
    [ -3, 2 ],
  )
  t.is(m.determinant, 17)
})

test("a submatrix of a 3x3 matrix is a 2x2 matrix", t => {
  const m = Matrix.of(
    [  1, 5,  0 ],
    [ -3, 2,  7 ],
    [  0, 6, -3 ],
  )
  t.deepEqual(m.submatrix(0, 2),
    Matrix.of(
      [ -3, 2 ],
      [  0, 6 ],
    )
  )
})

test("a submatrix of a 4x4 matrix is 3x3 matrix", t => {
  const m = Matrix.of(
    [ -6, 1,  1, 6 ],
    [ -8, 5,  8, 6 ],
    [ -1, 0,  8, 2 ],
    [ -7, 1, -1, 1 ],
  )
  t.deepEqual(m.submatrix(2, 1),
    Matrix.of(
      [ -6,  1, 6 ],
      [ -8,  8, 6 ],
      [ -7, -1, 1 ],
    )
  )
})

test("calculating a minor of a 3x3 matrix", t => {
  const a = Matrix.of(
    [ 3,  5,  0 ],
    [ 2, -1, -7 ],
    [ 6, -1,  5 ],
  )
  const b = a.submatrix(1, 0)
  t.is(b.determinant, 25)
  t.is(a.minor(1, 0), 25)
})

test("calculating a cofactor of a 3x3 matrix", t => {
  const a = Matrix.of(
    [ 3,  5,  0 ],
    [ 2, -1, -7 ],
    [ 6, -1,  5 ],
  )
  t.is(a.minor(0, 0), -12)
  t.is(a.cofactor(0, 0), -12)
  t.is(a.minor(1, 0), 25)
  t.is(a.cofactor(1, 0), -25)
})

test("calculating the determinant of a 3x3 matrix", t => {
  const a = Matrix.of(
    [  1, 2,  6 ],
    [ -5, 8, -4 ],
    [  2, 6,  4 ],
  )
  t.is(a.cofactor(0, 0), 56)
  t.is(a.cofactor(0, 1), 12)
  t.is(a.cofactor(0, 2), -46)
  t.is(a.determinant, -196)
})

test("calculating the determinant of a 4x4 matrix", t => {
  const a = Matrix.of(
    [ -2, -8,  3,  5 ],
    [ -3,  1,  7,  3 ],
    [  1,  2, -9,  6 ],
    [ -6,  7,  7, -9 ],
  )
  t.is(a.cofactor(0, 0), 690)
  t.is(a.cofactor(0, 1), 447)
  t.is(a.cofactor(0, 2), 210)
  t.is(a.cofactor(0, 3), 51)
  t.is(a.determinant, -4071)
})

test("testing an invertible matrix for invertibility", t => {
  const a = Matrix.of(
    [ 6,  4, 4,  4 ],
    [ 5,  5, 7,  6 ],
    [ 4, -9, 3, -7 ],
    [ 9,  1, 7, -6 ],
  )
  t.is(a.determinant, -2120)
  t.is(a.isInvertible, true)
})

test("testing an non-invertible matrix for invertibility", t => {
  const a = Matrix.of(
    [ -4,  3, -2, -3 ],
    [  9,  6,  2,  6 ],
    [  0, -5,  1, -5 ],
    [  0,  0,  0,  0 ],
  )
  t.is(a.determinant, 0)
  t.is(a.isInvertible, false)
})

test("calculating the inverse of a matrix", t => {
  const a = Matrix.of(
    [ -5,  2,  6, -8 ],
    [  1, -5,  1,  8 ],
    [  7,  7, -6, -7 ],
    [  1, -3,  7,  4 ],
  )
  const b = a.inverse
  t.is(a.determinant, 532)
  t.is(a.cofactor(2, 3), -160)
  t.is(b[3][2], -160 / 532)
  t.is(a.cofactor(3, 2), 105)
  t.is(b[2][3], 105 / 532)
  t.deepEqual(b.fixed,
    Matrix.of(
      [  0.21805 ,  0.45113 ,  0.24060 , -0.04511 ],
      [ -0.80827 , -1.45677 , -0.44361 ,  0.52068 ],
      [ -0.07895 , -0.22368 , -0.05263 ,  0.19737 ],
      [ -0.52256 , -0.81391 , -0.30075 ,  0.30639 ],
    )
  )
})

test("calculating the inverse of another matrix", t => {
  const a = Matrix.of(
    [  8, -5,  9,  2 ],
    [  7,  5,  6,  1 ],
    [ -6,  0,  9,  6 ],
    [ -3,  0, -9, -4 ],
  )
  t.deepEqual(a.inverse.fixed,
    Matrix.of(
      [ -0.15385, -0.15385, -0.28205, -0.53846 ],
      [ -0.07692,  0.12308,  0.02564,  0.03077 ],
      [  0.35897,  0.35897,  0.43590,  0.92308 ],
      [ -0.69231, -0.69231, -0.76923, -1.92308 ],
    )
  )
})

test("calculating the inverse of a third matrix", t => {
  const a = Matrix.of(
    [  9,  3,  0,  9 ],
    [ -5, -2, -6, -3 ],
    [ -4,  9,  6,  4 ],
    [ -7,  6,  6,  2 ],
  )
  t.deepEqual(a.inverse.fixed,
    Matrix.of(
      [ -0.04074, -0.07778,  0.14444, -0.22222 ],
      [ -0.07778,  0.03333,  0.36667, -0.33333 ],
      [ -0.02901, -0.14630, -0.10926,  0.12963 ],
      [  0.17778,  0.06667, -0.26667,  0.33333 ],
    )
  )
})

test("multiplying a product by its inverse", t => {
  const a = Matrix.of(
    [  3, -9,  7,  3 ],
    [  3, -8,  2, -9 ],
    [ -4,  4,  4,  1 ],
    [ -6,  5, -1,  1 ],
  )
  const b = Matrix.of(
    [ 8,  2, 2, 2 ],
    [ 3, -1, 7, 0 ],
    [ 7,  0, 5, 4 ],
    [ 6, -2, 0, 5 ],
  )
  const c = a.multiplyBy(b)
  const d = c.multiplyBy(b.inverse)
  t.deepEqual(d.fixed, a)
})
