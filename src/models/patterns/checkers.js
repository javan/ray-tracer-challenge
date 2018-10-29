import { Pattern } from "../pattern"

export class Checkers extends Pattern {
  colorAt({ x, y, z }) {
    return this[
      Math.abs(
        Math.floor(x) +
        Math.floor(y) +
        Math.floor(z)
      ) % this.length
    ]
  }
}
