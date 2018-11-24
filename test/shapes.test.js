import test from "ava"
import { Shape, Point, Vector, Matrix, Material } from "../src/models"

test("the default transformation", t => {
  const s = Shape.create()
  t.deepEqual(s.transform, Matrix.identity)
})

test("assigning a transformation", t => {
  const transform = Matrix.translation(2, 3, 4)
  const s = Shape.create({ transform })
  t.deepEqual(s.transform, transform)
})

test("the default material", t => {
  const s = Shape.create()
  t.deepEqual(s.material, Material.create())
})

test("assigning a material", t => {
  const s = Shape.create({ ambient: 1 })
  const m = Material.create({ ambient: 1 })
  t.deepEqual(s.material, m)
})

test("computing the normal on a translated shape", t => {
  const s = Shape.create({ transform: Matrix.translation(0, 1, 0) })
  const n = s.normalAt(Point(0, 1.70711, -0.70711))
  t.deepEqual(n.fixed, Vector(0, 0.70711, -0.70711))
})

test("computing the normal on a scaled shape", t => {
  const s = Shape.create({ transform: Matrix.scaling(1, 0.5, 1) })
  const n = s.normalAt(Point(0, Math.SQRT2 / 2, -Math.SQRT2 / 2))
  t.deepEqual(n.fixed, Vector(0, 0.97014, -0.24254))
})
