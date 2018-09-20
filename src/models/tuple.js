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
    return this.map((value, index) => value * tuple[index]).reduce(sum)
  }

  clamp(min, max) {
    const values = this.map(value => Math.max(min, Math.min(max, value)))
    return new this.constructor(...values)
  }

  get round() {
    const values = this.map(value => Math.round(value))
    return new this.constructor(...values)
  }

  get negate() {
    return this.multiplyBy(-1)
  }

  get normalize() {
    return this.divideBy(this.magnitude)
  }

  get magnitude() {
    return Math.sqrt(this.map(value => value ** 2).reduce(sum))
  }
}

const sum = (result, value) => result + value
