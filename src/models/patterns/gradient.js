import { Pattern } from "../pattern"

export class Gradient extends Pattern {
  colorAt({ x }) {
    const distance = this[1].subtract(this[0])
    const fraction = x - Math.floor(x)
    return this[0].add(distance.multiplyBy(fraction))
  }
}
