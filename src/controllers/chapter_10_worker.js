import { Camera, Color, Matrix, Plane, Point, PointLight, Sphere, Vector, World } from "../models"
import { Stripe, Gradient, Ring, Checkers } from "../models"

onmessage = ({ data }) => {
  const scene = new Scene(data.width, data.height)
  let { startX, endX } = data

  function sendBatch() {
    const x = startX
    const width = Math.min(x + 10, endX) - x
    startX += width

    const colors = scene.getColorData(x, width).buffer
    postMessage({ x, width, colors }, [ colors ])

    if (startX < endX) {
      sendBatch()
    } else {
      postMessage({}) // Done
    }
  }
  sendBatch()
}

class Scene {
  constructor(width, height) {
    this.width = width
    this.height = height
  }

  *getColors(x, width) {
    for (const pixel of this.camera.pixelsForWorld(this.world, x, x + width)) {
      yield pixel.color
    }
  }

  getColorData(x, width) {
    const { data } = new ImageData(width, this.height)
    let index = 0
    for (const color of this.getColors(x, width)) {
      for (const value of color.rgba) {
        data[index++] = value
      }
    }
    return data
  }

  get camera() {
    return Camera.create({
      hsize: this.width,
      vsize: this.height,
      view: Math.PI / 3,
      transform: Matrix.viewTransform(
        Point(-5, 2, -4),
        Point(0, 2, 0),
        Vector(0, 1, 0)
      )
    })
  }

  get world() {
    const world = World.of(this.floor, this.wall, this.sphere)
    world.light = new PointLight(Point(0, 7.5, -10), Color.WHITE.multiplyBy(1.2))
    return world
  }

  get floor() {
    const pattern = Checkers.of(Color.WHITE, Color.BLACK)
    pattern.transform = Matrix.rotationY(Math.PI / 4).multiplyBy( Matrix.scaling(2,2,2) )
    return Plane.create({
      pattern,
      ambient: 0.2,
    })
  }

  get wall() {
    const pattern = Ring.of(Color.WHITE, Color.of(1, 0, 0))
    return Plane.create({
      pattern,
      diffuse: 0.7,
      transform: Matrix.translation(0, 0, 5)
        .multiplyBy( Matrix.rotationX(Math.PI / 2) )
    })
  }

  get sphere() {
    const pattern = Stripe.of(Color.of(1, 0.5, 0), Color.of(1, 0.3, 0))
    pattern.transform = Matrix.rotationZ( Math.PI / 2).multiplyBy( Matrix.scaling(0.2, 0.2, 0.2) )
    return Sphere.create({
      pattern
    })
  }
}
