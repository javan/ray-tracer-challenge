export class StripePattern extends Array {
  colorAt(point, object) {
    if (object) {
      point = object.transform.inverse.multiplyBy(point)
      if (this.transform) {
        point = this.transform.inverse.multiplyBy(point)
      }
    }
    return this[ Math.abs(Math.floor(point.x) % this.length) ]
  }
}
