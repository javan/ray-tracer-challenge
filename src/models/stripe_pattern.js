export class StripePattern extends Array {
  colorAt(point) {
    return this[ Math.abs(Math.floor(point.x) % this.length) ]
  }
}
