export const tuple = (...values) => new Tuple(...values)
export const position = (x, y, z, w) => new Position(x, y, z, w)
export const vector = (x, y, z) => position(x, y, z, 0)
export const point = (x, y, z) => position(x, y, z, 1)

class Tuple extends Array {
  add(tuple) {
    const values = this.map((value, index) => value + tuple[index])
    return new this.constructor(...values)
  }

  subtract(tuple) {
    const values = this.map((value, index) => value - tuple[index])
    return new this.constructor(...values)
  }

  multiplyBy(number) {
    const values = this.map(value => value * number)
    return new this.constructor(...values)
  }

  divideBy(number) {
    return this.multiplyBy(1 / number)
  }

  dotProduct(tuple) {
    return this.map((value, index) => value * tuple[index]).reduce(sum)
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

class Position extends Tuple {
  get x() { return this[0] }
  get y() { return this[1] }
  get z() { return this[2] }
  get w() { return this[3] }

  get isPoint()  { return this.w == 1 }
  get isVector() { return this.w == 0 }

  crossProduct(position) {
    if (!this.isVector || !position.isVector)
      throw new Error("Positions must be vectors")

    return new this.constructor(
      this.y * position.z - this.z * position.y,
      this.z * position.x - this.x * position.z,
      this.x * position.y - this.y * position.x,
      this.w
    )
  }
}

const sum = (result, value) => result + value

