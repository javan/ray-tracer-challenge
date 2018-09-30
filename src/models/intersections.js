export class Intersections extends Array {
  get hit() {
    return this.visible.sort((a, b) => a.t - b.t)[0]
  }

  get visible() {
    return this.filter(i => i.t > 0)
  }
}
