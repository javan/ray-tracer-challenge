import { dotProduct, sum } from "./math"

export class Tuple extends Array {
  add(tuple) {
    const values = this.map((value, index) => value + tuple[index])
    return new this.constructor(...values)
  }

  subtract(tuple) {
    const values = this.map((value, index) => value - tuple[index])
    return new this.constructor(...values)
  }

  multiplyBy(object) {
    const values = object instanceof Tuple
      ? this.map((value, index) => value * object[index])
      : this.map(value => value * object)
    return new this.constructor(...values)
  }

  divideBy(number) {
    return this.multiplyBy(1 / number)
  }

  dotProduct(tuple) {
    return dotProduct(this, tuple)
  }

  clamp(min, max) {
    const values = this.map(value => Math.max(min, Math.min(max, value)))
    return new this.constructor(...values)
  }

  get round() {
    const values = this.map(value => Math.round(value))
    const value = new this.constructor(...values)
    Object.defineProperty(this, "round", { value })
    return value
  }

  get fixed() {
    const values = this.map(value => Number(value.toFixed(5)))
    return new this.constructor(...values)
  }

  get negate() {
    const value = this.multiplyBy(-1)
    Object.defineProperty(this, "negate", { value })
    return value
  }

  get normalize() {
    const value =  this.divideBy(this.magnitude)
    Object.defineProperty(this, "normalize", { value })
    return value
  }

  get magnitude() {
    const value = Math.sqrt(this.map(value => value ** 2).reduce(sum))
    Object.defineProperty(this, "magnitude", { value })
    return value
  }
}
