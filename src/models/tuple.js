import { dotProduct, product } from "./math"

export class Tuple extends Array {
  add(tuple) {
    return this.map((value, index) => value + tuple[index])
  }

  subtract(tuple) {
    return this.map((value, index) => value - tuple[index])
  }

  multiplyBy(object) {
    return object instanceof Tuple
      ? this.map((value, index) => product(value, object[index]))
      : this.map(value => product(value, object))
  }

  divideBy(number) {
    return this.multiplyBy(1 / number)
  }

  dotProduct(tuple) {
    return dotProduct(this, tuple)
  }

  clamp(min, max) {
    return this.map(value => Math.max(min, Math.min(max, value)))
  }

  get round() {
    const value = this.map(value => Math.round(value))
    Object.defineProperty(this, "round", { value })
    return value
  }

  get fixed() {
    return this.map(value => Number(value.toFixed(5)))
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
    const value = Math.sqrt(this.reduce((sum, value) => {
      return sum + value ** 2
    }, 0))
    Object.defineProperty(this, "magnitude", { value })
    return value
  }
}
