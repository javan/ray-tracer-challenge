export class Intersections extends Array {
  get hit() {
    return this.visible.sorted[0]
  }

  get sorted() {
    return this.slice(0).sort((a, b) => a.t - b.t)
  }

  get visible() {
    return this.filter(i => i.t > 0)
  }
}
