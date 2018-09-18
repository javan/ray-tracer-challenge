import test from "ava"
import { canvas } from "./canvas"
import { color } from "./tuples"

const black = color(0, 0, 0)
const red = color(1, 0, 0)

test("creating a canvas", t => {
  const c = canvas(10, 20)
  t.is(c.width, 10)
  t.is(c.height, 20)
  // every pixel of c is color(0, 0, 0)
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 20; y++) {
      t.deepEqual(c.pixelAt(x, y), black)
    }
  }
})

test("writing pixels to a canvas", t => {
  const c = canvas(10, 20)
  c.writePixel(2, 3, red)
  t.deepEqual(c.pixelAt(2, 3), red)
  t.deepEqual(c.pixelAt(2, 2), black)
  t.deepEqual(c.pixelAt(1, 3), black)
})
