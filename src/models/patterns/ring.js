import { Pattern } from "../pattern"

export class Ring extends Pattern {
  colorAt({ x, z }) {
    return this[
      Math.floor(
        Math.sqrt(x ** 2 + z ** 2)
      ) % this.length
    ]
  }
}
