import { Camera, Color, Matrix, Plane, Point, PointLight, Sphere, Vector, World } from "../models"

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
        Point(0, 1, -5),
        Point(0, 1, 0),
        Vector(0, 1, 0)
      )
    })
  }

  get world() {
    const world = World.of(
      this.floor,
      this.sphere,
    )
    world.light = new PointLight(Point(-10, 10, -10), Color.WHITE)
    return world
  }

  get floor() {
    return Plane.create({
      color: Color.of(1, 0.9, 0.9)
    })
  }

  get sphere() {
    return Sphere.create({
      color: Color.of(0.1, 1, 0.5),
      diffuse: 0.7,
      specular: 0.3,
      transform: Matrix.translation(-0.5, 1, 0.5)
    })
  }
}
