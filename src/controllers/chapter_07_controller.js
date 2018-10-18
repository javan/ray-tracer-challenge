import { Camera, Color, Matrix, Point, PointLight, Sphere, Vector, World } from "../models"
import { nextFrame, DOMCanvasProxy } from "../helpers"
import { Controller } from "stimulus"

const HSIZE = 100 * window.devicePixelRatio
const VSIZE = 75  * window.devicePixelRatio

export default class extends Controller {
  static targets = [ "preview", "stats" ]

  connect() {
    this.render()
  }

  // Actions

  async render() {
    await nextFrame()

    const { camera } = this
    this.canvas = new DOMCanvasProxy(camera.hsize, camera.vsize)
    this.previewTarget.innerHTML = ""
    this.previewTarget.appendChild(this.canvas.element)

    await nextFrame()

    const startTime = performance.now()
    const { world } = this
    camera.render(world, this.canvas)
    const time = performance.now() - startTime

    await nextFrame()

    const { format } = new Intl.NumberFormat
    this.statsTarget.innerHTML = [
      `Rendered in ${format(time)}ms.`
    ].join("<br>")
  }

  async download(event) {
    const blob = this.canvas.toPPM().toBlob()
    const url = URL.createObjectURL(blob)
    event.currentTarget.href = url

    await nextFrame()
    URL.revokeObjectURL(url)
  }

  // Private

  get camera() {
    return Camera.create({
      hsize: HSIZE,
      vsize: VSIZE,
      view: Math.PI / 3,
      transform: Matrix.viewTransform(
        Point(0, 1.5, -5),
        Point(0, 1, 0),
        Vector(0, 1, 0)
      )
    })
  }

  get world() {
    const world = World.of(
      this.floor,
      this.leftWall,
      this.rightWall,
      this.leftSphere,
      this.middleSphere,
      this.rightSphere
    )
    world.light = new PointLight(Point(-10, 10, -10), Color.WHITE)
    return world
  }

  get floor() {
    return Sphere.create({
      color: Color.of(1, 0.9, 0.9),
      specular: 0,
      transform: Matrix.scaling(10, 0.01, 10)
    })
  }

  get leftWall() {
    return Sphere.create({
      color: Color.of(1, 0.9, 0.9),
      specular: 0,
      transform: Matrix.translation(0, 0, 5)
        .multiplyBy( Matrix.rotationY(-Math.PI / 4) )
        .multiplyBy( Matrix.rotationX(Math.PI / 2) )
        .multiplyBy( Matrix.scaling(10, 0.01, 10) )
    })
  }

  get rightWall() {
    return Sphere.create({
      color: Color.of(1, 0.9, 0.9),
      specular: 0,
      transform: Matrix.translation(0, 0, 5)
        .multiplyBy( Matrix.rotationY(Math.PI / 4) )
        .multiplyBy( Matrix.rotationX(Math.PI / 2) )
        .multiplyBy( Matrix.scaling(10, 0.01, 10) )
    })
  }

  get leftSphere() {
    return Sphere.create({
      color: Color.of(1, 0.8, 0.1),
      diffuse: 0.7,
      specular: 0.3,
      transform: Matrix.translation(-1.5, 0.33, -0.75)
        .multiplyBy( Matrix.scaling(0.33, 0.33, 0.33) )
    })
  }

  get middleSphere() {
    return Sphere.create({
      color: Color.of(0.1, 1, 0.5),
      diffuse: 0.7,
      specular: 0.3,
      transform: Matrix.translation(-0.5, 1, 0.5)
    })
  }

  get rightSphere() {
    return Sphere.create({
      color: Color.of(0.5, 1, 0.1),
      diffuse: 0.7,
      specular: 0.3,
      transform: Matrix.translation(1.5, 0.5, -0.5)
        .multiplyBy( Matrix.scaling(0.5, 0.5, 0.5) )
    })
  }
}
