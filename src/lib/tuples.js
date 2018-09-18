export function tuple(x, y, z, w) {
  return new Tuple(x, y, z, w)
}

export function point(x, y, z) {
  return tuple(x, y, z, 1)
}

export function vector(x, y, z) {
  return tuple(x, y, z, 0)
}

class Tuple {
  constructor(x, y, z, w) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  add(tuple) {
    return new Tuple(
      this.x + tuple.x,
      this.y + tuple.y,
      this.z + tuple.z,
      this.w + tuple.w
    )
  }

  subtract(tuple) {
    return new Tuple(
      this.x - tuple.x,
      this.y - tuple.y,
      this.z - tuple.z,
      this.w - tuple.w
    )
  }

  multiplyBy(value) {
    return new Tuple(
      this.x * value,
      this.y * value,
      this.z * value,
      this.w * value
    )
  }

  divideBy(value) {
    return this.multiplyBy(1 / value)
  }

  dotProduct(tuple) {
    return (
      this.x * tuple.x +
      this.y * tuple.y +
      this.z * tuple.z +
      this.w * tuple.w
    )
  }

  crossProduct(tuple) {
    if (!this.isVector || !tuple.isVector)
      throw new Error("Tuples must be vectors")

    return new Tuple(
      this.y * tuple.z - this.z * tuple.y,
      this.z * tuple.x - this.x * tuple.z,
      this.x * tuple.y - this.y * tuple.x,
      this.w
    )
  }

  get negate() {
    return this.multiplyBy(-1)
  }

  get normalize() {
    const { magnitude } = this
    return new Tuple(
      this.x / magnitude,
      this.y / magnitude,
      this.z / magnitude,
      this.w / magnitude
    )
  }

  get magnitude() {
    return Math.sqrt(
      this.x ** 2 +
      this.y ** 2 +
      this.z ** 2 +
      this.w ** 2
    )
  }

  get isPoint() {
    return this.w == 1
  }

  get isVector() {
    return this.w == 0
  }
}
