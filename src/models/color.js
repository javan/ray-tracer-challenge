import { Tuple } from "./tuple"

export class Color extends Tuple {
  get red()   { return this[0] }
  get green() { return this[1] }
  get blue()  { return this[2] }

  get rgb() {
    const values = this.multiplyBy(255).clamp(0, 255).round
    const value = Uint8ClampedArray.of(...values)
    Object.defineProperty(this, "rgb", { value })
    return value
  }

  get rgba() {
    const value = Uint8ClampedArray.of(...this.rgb, 255)
    Object.defineProperty(this, "rgba", { value })
    return value
  }
}

Color.BLACK = Color.of(0, 0, 0)
Color.WHITE = Color.of(1, 1, 1)
