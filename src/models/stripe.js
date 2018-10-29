import { Pattern } from "./pattern"

export class Stripe extends Pattern {
  colorAt({ x }) {
    return this[ Math.abs(Math.floor(x) % this.length) ]
  }
}
