import { Tuple } from "./tuple"
import { dotProduct } from "./math"

export class Matrix extends Array {
  static translation(x, y, z) {
    const matrix = this.identity
    matrix[0][3] = x
    matrix[1][3] = y
    matrix[2][3] = z
    return matrix
  }

  static scaling(x, y, z) {
    const matrix = this.identity
    matrix[0][0] = x
    matrix[1][1] = y
    matrix[2][2] = z
    return matrix
  }

  static shearing(xy, xz, yx, yz, zx, zy) {
    const matrix = this.identity
    matrix[0][1] = xy
    matrix[0][2] = xz
    matrix[1][0] = yx
    matrix[1][2] = yz
    matrix[2][0] = zx
    matrix[2][1] = zy
    return matrix
  }

  static rotationX(radians) {
    const matrix = this.identity
    matrix[1][1] =  Math.cos(radians)
    matrix[1][2] = -Math.sin(radians)
    matrix[2][1] =  Math.sin(radians)
    matrix[2][2] =  Math.cos(radians)
    return matrix
  }

  static rotationY(radians) {
    const matrix = this.identity
    matrix[0][0] =  Math.cos(radians)
    matrix[0][2] =  Math.sin(radians)
    matrix[2][0] = -Math.sin(radians)
    matrix[2][2] =  Math.cos(radians)
    return matrix
  }

  static rotationZ(radians) {
    const matrix = this.identity
    matrix[0][0] =  Math.cos(radians)
    matrix[0][1] = -Math.sin(radians)
    matrix[1][0] =  Math.sin(radians)
    matrix[1][1] =  Math.cos(radians)
    return matrix
  }

  static get identity() {
    return Matrix.of(
      [ 1, 0, 0, 0 ],
      [ 0, 1, 0, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 0, 1 ],
    )
  }

  multiplyBy(object) {
    if (object instanceof Tuple) {
      const values = this.map(row => dotProduct(row, object))
      return object.constructor.of(...values)
    } else {
      const matrix = object
      const values = this.map(row => row.map((_, index) => dotProduct(row, matrix.columns[index])))
      return Matrix.of(...values)
    }
  }

  divideBy(number) {
    const values = this.map(values => values.map(value => value / number))
    return Matrix.of(...values)
  }

  submatrix(row, column) {
    const matrix = this.clone
    matrix.splice(row, 1)
    matrix.forEach(values => values.splice(column, 1))
    return matrix
  }

  minor(row, column) {
    return this.submatrix(row, column).determinant
  }

  cofactor(row, column) {
    const minor = this.minor(row, column)
    return isOdd(row + column) ? minor * -1 : minor
  }

  get clone() {
    return Matrix.from(this.map(values => Array.from(values)))
  }

  get columns() {
    const value = this.map((_, index) => Array.from({ length: this.length }, (_, rowIndex) => this[rowIndex][index]))
    Object.defineProperty(this, "columns", { value })
    return value
  }

  get transpose() {
    const value = Matrix.from(this.columns)
    Object.defineProperty(this, "transpose", { value })
    return value
  }

  get determinant() {
    const value = this.length == 2
      ? this[0][0] * this[1][1] - this[0][1] * this[1][0]
      : dotProduct(this[0], this[0].map((_, index) => this.cofactor(0, index)))
    Object.defineProperty(this, "determinant", { value })
    return value
  }

  get cofactors() {
    const values = this.map((values, row) => values.map((_, column) => this.cofactor(row, column)))
    const value = Matrix.from(values)
    Object.defineProperty(this, "cofactors", { value })
    return value
  }

  get inverse() {
    const value = this.cofactors.transpose.divideBy(this.determinant)
    Object.defineProperty(this, "inverse", { value })
    return value
  }

  get isInvertible() {
    return this.determinant != 0
  }

  get fixed() {
    const values = this.map(values => values.map(value => Number(value.toFixed(5))))
    return Matrix.of(...values)
  }
}

function isOdd(number) {
  return number % 2 != 0
}
