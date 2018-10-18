import test from "ava"
import { Camera, Matrix, Point, Vector, World, Color } from "../src/models"

test("constructing a camera", t => {
  const hsize = 160
  const vsize = 120
  const view = Math.PI / 2
  const c = Camera.create({ hsize, vsize, view })
  t.is(c.hsize, 160)
  t.is(c.vsize, 120)
  t.is(c.view, Math.PI / 2)
  t.deepEqual(c.transform, Matrix.identity)
})

test("the pixel size for a horizontal canvas", t => {
  const c = Camera.create({ hsize: 200, vsize: 125, view: Math.PI / 2 })
  t.is(fixed(c.pixelSize), 0.01)
})

test("the pixel size for a verical canvas", t => {
  const c = Camera.create({ hsize: 125, vsize: 200, view: Math.PI / 2 })
  t.is(fixed(c.pixelSize), 0.01)
})

test("construct a ray through the center of the canvas", t => {
  const c = Camera.create({ hsize: 201, vsize: 101, view: Math.PI / 2 })
  const r = c.rayForPixel(100, 50)
  t.deepEqual(r.origin, Point(0, 0, 0))
  t.deepEqual(r.direction.fixed, Vector(0, 0, -1).fixed)
})

test("construct a ray through a corner of the canvas", t => {
  const c = Camera.create({ hsize: 201, vsize: 101, view: Math.PI / 2 })
  const r = c.rayForPixel(0, 0)
  t.deepEqual(r.origin, Point(0, 0, 0))
  t.deepEqual(r.direction.fixed, Vector(0.66519, 0.33259, -0.66851).fixed)
})

test("construct a ray when the camera is transformed", t => {
  const transform = Matrix.rotationY(Math.PI / 4).multiplyBy(Matrix.translation(0, -2, 5))
  const c = Camera.create({ hsize: 201, vsize: 101, view: Math.PI / 2, transform })
  const r = c.rayForPixel(100, 50)
  t.deepEqual(r.origin, Point(0, 2, -5))
  t.deepEqual(r.direction.fixed, Vector(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2).fixed)
})

test("rendering a world with a camera", t => {
  const w = World.default
  const from = Point(0, 0, -5)
  const to = Point(0, 0, 0)
  const up = Vector(0, 1, 0)
  const transform = Matrix.viewTransform(from, to, up)
  const c = Camera.create({ hsize: 11, vsize: 11, view: Math.PI / 2, transform })
  const canvas = c.render(w)
  t.deepEqual(canvas.pixelAt(5, 5).fixed, Color.of(0.38066, 0.47583, 0.2855).fixed)
})

function fixed(number, digits = 2) {
  return Number(number.toFixed(digits))
}
