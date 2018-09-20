import test from "ava"
import { Canvas, Color } from "../src/models"

const black = Color.of(0, 0, 0)
const red = Color.of(1, 0, 0)

test("creating a canvas", t => {
  const c = new Canvas(10, 20)
  t.is(c.width, 10)
  t.is(c.height, 20)
  // every pixel of c is Color.of(0, 0, 0)
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      t.deepEqual(c.pixelAt(x, y), black)
    }
  }
})

test("writing pixels to a canvas", t => {
  const c = new Canvas(10, 20)
  c.writePixel(2, 3, red)
  t.deepEqual(c.pixelAt(2, 3), red)
  t.deepEqual(c.pixelAt(2, 2), black)
  t.deepEqual(c.pixelAt(1, 3), black)
})

test("constructing the PPM header", t => {
  const c = new Canvas(5, 3)
  const lines = c.toPPM().split("\n")
  t.is(lines[0], "P3")
  t.is(lines[1], "5 3")
  t.is(lines[2], "255")
})

test("constructing the PPM pixel data", t => {
  const c = new Canvas(5, 3)
  c.writePixel(0, 0, Color.of(1.5, 0, 0))
  c.writePixel(2, 1, Color.of(0, 0.5, 0))
  c.writePixel(4, 2, Color.of(-0.5, 0, 1))
  const lines = c.toPPM().split("\n")
  t.is(lines[3], "255 0 0 0 0 0 0 0 0 0 0 0 0 0 0")
  t.is(lines[4], "0 0 0 0 0 0 0 128 0 0 0 0 0 0 0")
  t.is(lines[5], "0 0 0 0 0 0 0 0 0 0 0 0 0 0 255")
})

test("splitting long lines in PPM files", t => {
  const c = new Canvas(10, 20, Color.of(1, 0.8, 0.6))
  const lines = c.toPPM().split("\n")
  t.is(lines[3], "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204")
  t.is(lines[4], "153 255 204 153 255 204 153 255 204 153 255 204 153")
  t.is(lines[5], "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204")
  t.is(lines[6], "153 255 204 153 255 204 153 255 204 153 255 204 153")
})

test("PPM files are terminated by a newline", t => {
  const c = new Canvas(5, 3)
  t.is(c.toPPM().slice(-1), "\n")
})
