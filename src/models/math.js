export function dotProduct(a, b) {
  return a.reduce((sum, value, index) => {
    return sum + value * b[index]
  }, 0)
}

export function product(a, b) {
  return a == 0 ? 0 : a * b
}
