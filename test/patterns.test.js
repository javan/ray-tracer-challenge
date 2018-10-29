import test from "ava"
import { Pattern, Stripe, Gradient, Color, Point, Sphere, Matrix } from "../src/models"

const { WHITE, BLACK } = Color

test("the default pattern transformation", t => {
  const pattern = new Pattern
  t.deepEqual(pattern.transform, Matrix.identity)
})

test("assigning a transformation", t => {
  const pattern = new Pattern
  pattern.transform = Matrix.translation(1, 2, 3)
  t.deepEqual(pattern.transform, Matrix.translation(1, 2, 3))
})

test("pattern with an object transformation", t => {
  const pattern = new Pattern
  const shape = Sphere.create({ transform: Matrix.scaling(2, 2, 2) })
  const color = pattern.colorAtShape(shape, Point(2, 3, 4))
  t.deepEqual(color, Color.of(1, 1.5, 2))
})

test("pattern with a pattern transformation", t => {
  const pattern = new Pattern
  pattern.transform = Matrix.scaling(2, 2, 2)
  const shape = Sphere.create()
  const color = pattern.colorAtShape(shape, Point(2, 3, 4))
  t.deepEqual(color, Color.of(1, 1.5, 2))
})

test("pattern with both an object and a pattern transformation", t => {
  const pattern = new Pattern
  pattern.transform = Matrix.translation(0.5, 1, 1.5)
  const shape = Sphere.create({ transform: Matrix.scaling(2, 2, 2) })
  const color = pattern.colorAtShape(shape, Point(2.5, 3, 3.5))
  t.deepEqual(color, Color.of(0.75, 0.5, 0.25))
})

test("creating a stripe pattern", t => {
  const pattern = Stripe.of(WHITE, BLACK)
  t.is(pattern[0], WHITE)
  t.is(pattern[1], BLACK)
})

test("a stripe pattern is constant in y", t => {
  const pattern = Stripe.of(WHITE, BLACK)
  t.is(pattern.colorAt(Point(0, 0, 0)), WHITE)
  t.is(pattern.colorAt(Point(0, 1, 0)), WHITE)
  t.is(pattern.colorAt(Point(0, 2, 0)), WHITE)
})

test("a stripe pattern is constant in z", t => {
  const pattern = Stripe.of(WHITE, BLACK)
  t.is(pattern.colorAt(Point(0, 0, 0)), WHITE)
  t.is(pattern.colorAt(Point(0, 0, 1)), WHITE)
  t.is(pattern.colorAt(Point(0, 0, 2)), WHITE)
})

test("a stripe pattern alternates in x", t => {
  const pattern = Stripe.of(WHITE, BLACK)
  t.is(pattern.colorAt(Point(0, 0, 0)), WHITE)
  t.is(pattern.colorAt(Point(0.9, 0, 0)), WHITE)
  t.is(pattern.colorAt(Point(1, 0, 0)), BLACK)
  t.is(pattern.colorAt(Point(-0.1, 0, 0)), BLACK)
  t.is(pattern.colorAt(Point(-1, 0, 0)), BLACK)
  t.is(pattern.colorAt(Point(-1.1, 0, 0)), WHITE)
})

test("a gradient pattern linearly interpolates between colors", t => {
  const pattern = Gradient.of(BLACK, WHITE)
  t.deepEqual(pattern.colorAt(Point(0, 0, 0)), BLACK)
  t.deepEqual(pattern.colorAt(Point(0.25, 0, 0)), Color.of(0.25, 0.25, 0.25))
  t.deepEqual(pattern.colorAt(Point(0.5, 0, 0)), Color.of(0.5, 0.5, 0.5))
  t.deepEqual(pattern.colorAt(Point(0.75, 0, 0)), Color.of(0.75, 0.75, 0.75))
})
