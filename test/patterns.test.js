import test from "ava"
import { StripePattern, Color, Point } from "../src/models"

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
