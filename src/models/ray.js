export class Ray {
  constructor(origin, direction) {
    this.origin = origin
    this.direction = direction
  }

  position(t) {
    return this.origin.add(this.direction.multiplyBy(t))
  }

  intersect(shape) {
    const ray = this.transform(shape.transform.inverse)
    return shape.intersect(ray)
  }

  transform(matrix) {
    const origin = matrix.multiplyBy(this.origin)
    const direction = matrix.multiplyBy(this.direction)
    return new Ray(origin, direction)
  }
}
