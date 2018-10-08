import test from "ava"
import { PointLight, Position, Color } from "../src/models"

test("a point light has a position and intensity", t => {
  const position = Position.point(0, 0, 0)
  const intensity = Color.of(1, 1, 1)
  const light = new PointLight(position, intensity)
  t.deepEqual(light.position, position)
  t.deepEqual(light.intensity, intensity)
})
