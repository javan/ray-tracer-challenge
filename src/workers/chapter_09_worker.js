import { Camera, Color, Matrix, Plane, Point, PointLight, Sphere, Vector, World } from "../models"

onmessage = ({ data }) => {
  const scene = new Scene(data.hsize, data.vsize)

  let { startX, endX } = data
  async function sendBatch() {
    await nextFrame()
    postMessage({ pixels: scene.getPixels(startX, ++startX) })

    if (startX < endX) {
      sendBatch()
    } else {
      postMessage({}) // Done
    }
  }
  sendBatch()
}

class Scene {
  constructor(hsize, vsize) {
    this.hsize = hsize
    this.vsize = vsize
  }

  getPixels(startX, endX) {
    return [...this.camera.pixelsForWorld(this.world, startX, endX)]
  }

  get camera() {
    return Camera.create({
      hsize: this.hsize,
      vsize: this.vsize,
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
      color: Color.of(1, 0.9, 0.9),
      shininess: 1
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

async function nextFrame() {
  return new Promise(resolve => {
    self.requestAnimationFrame
      ? requestAnimationFrame(resolve)
      : setTimeout(resolve, 17)
  })
}
