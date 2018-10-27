import test from "ava"
import { StripePattern, Color, Point, Sphere, Matrix } from "../src/models"

const { WHITE, BLACK } = Color

test("creating a stripe pattern", t => {
  const pattern = StripePattern.of(WHITE, BLACK)
  t.is(pattern[0], WHITE)
  t.is(pattern[1], BLACK)
})

test("a stripe pattern is constant in y", t => {
  const pattern = StripePattern.of(WHITE, BLACK)
  t.is(pattern.colorAt(Point(0, 0, 0)), WHITE)
  t.is(pattern.colorAt(Point(0, 1, 0)), WHITE)
  t.is(pattern.colorAt(Point(0, 2, 0)), WHITE)
})

test("a stripe pattern is constant in z", t => {
  const pattern = StripePattern.of(WHITE, BLACK)
  t.is(pattern.colorAt(Point(0, 0, 0)), WHITE)
  t.is(pattern.colorAt(Point(0, 0, 1)), WHITE)
  t.is(pattern.colorAt(Point(0, 0, 2)), WHITE)
})

test("a stripe pattern alternates in x", t => {
  const pattern = StripePattern.of(WHITE, BLACK)
  t.is(pattern.colorAt(Point(0, 0, 0)), WHITE)
  t.is(pattern.colorAt(Point(0.9, 0, 0)), WHITE)
  t.is(pattern.colorAt(Point(1, 0, 0)), BLACK)
  t.is(pattern.colorAt(Point(-0.1, 0, 0)), BLACK)
  t.is(pattern.colorAt(Point(-1, 0, 0)), BLACK)
  t.is(pattern.colorAt(Point(-1.1, 0, 0)), WHITE)
})

test("stripes with an object transformation", t => {
  const pattern = StripePattern.of(BLACK, WHITE)
  const object = Sphere.create({ transform: Matrix.scaling(2, 2, 2) })
  const color = pattern.colorAt(Point(1.5, 0, 0), object)
  t.is(color, BLACK)
})

test("stripes with a pattern transformation", t => {
  const pattern = StripePattern.of(BLACK, WHITE)
  pattern.transform = Matrix.scaling(2, 2, 2)
  const object = Sphere.create()
  const color = pattern.colorAt(Point(1.5, 0, 0), object)
  t.is(color, BLACK)
})

test("stripes with both an object and a pattern transformation", t => {
  const pattern = StripePattern.of(BLACK, WHITE)
  pattern.transform = Matrix.translation(0.5, 0, 0)
  const object = Sphere.create({ transform: Matrix.scaling(2, 2, 2) })
  const color = pattern.colorAt(Point(2.5, 0, 0), object)
  t.is(color, BLACK)
})
