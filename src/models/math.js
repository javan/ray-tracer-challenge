export function dotProduct(a, b) {
  return a.map((value, index) => value * b[index]).reduce(sum)
}

export function product(a, b) {
  return a == 0 ? 0 : a * b
}

export function sum(a, b) {
  return a + b
}
