import { Tuple } from "./tuple"
import { dotProduct } from "./math"

export class Matrix extends Array {
  multiplyBy(object) {
    if (object instanceof Tuple) {
      const tuple = object
      const matrix = Matrix.of(...tuple.map(value => [value]))
      return Tuple.of(...this.multiplyBy(matrix).columns[0])
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

  toFixed(digits) {
    const values = this.map(values => values.map(value => Number(value.toFixed(digits))))
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
    return Matrix.from(this.columns)
  }

  get determinant() {
    if (this.length == 2) {
      return this[0][0] * this[1][1] - this[0][1] * this[1][0]
    } else {
      return dotProduct(this[0], this[0].map((_, index) => this.cofactor(0, index)))
    }
  }

  get cofactors() {
    const values = this.map((values, row) => values.map((_, column) => this.cofactor(row, column)))
    return Matrix.from(values)
  }

  get inverse() {
    return this.cofactors.transpose.divideBy(this.determinant)
  }

  get isInvertible() {
    return this.determinant != 0
  }
}

function isOdd(number) {
  return number % 2 != 0
}
