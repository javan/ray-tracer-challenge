export function dotProduct(a, b) {
  return a.map((value, index) => value * b[index]).reduce(sum)
}

export function sum(a, b) {
  return a + b
}
