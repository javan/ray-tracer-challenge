import { Camera, Color, Matrix, Point, PointLight, Sphere, Vector, World } from "../models"

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

const FLOOR_COLOR = Color.of(1, 1, 0.92)

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
        Point(-3, 1.5, -6),
        Point(-1, 1.5, 0),
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
      this.topSphere,
      this.middleSphere,
      this.rightSphere
    )
    world.light = new PointLight(Point(-10, 8, -10), Color.WHITE)
    return world
  }

  get floor() {
    return Sphere.create({
      color: FLOOR_COLOR,
      specular: 0,
      transform: Matrix.scaling(10, 0.01, 10)
    })
  }

  get leftWall() {
    return Sphere.create({
      color: FLOOR_COLOR,
      specular: 0,
      transform: Matrix.translation(0, 0, 5)
        .multiplyBy( Matrix.rotationY(-Math.PI / 4) )
        .multiplyBy( Matrix.rotationX(Math.PI / 2) )
        .multiplyBy( Matrix.scaling(10, 0.01, 10) )
    })
  }

  get rightWall() {
    return Sphere.create({
      color: FLOOR_COLOR,
      specular: 0,
      transform: Matrix.translation(0, 0, 5)
        .multiplyBy( Matrix.rotationY(Math.PI / 4) )
        .multiplyBy( Matrix.rotationX(Math.PI / 2) )
        .multiplyBy( Matrix.scaling(10, 0.01, 10) )
    })
  }

  get leftSphere() {
    return Sphere.create({
      color: Color.of(1.2, 0, 0),
      diffuse: 0.7,
      specular: 0.3,
      transform: Matrix.translation(-2.9, 1.6, -1.8)
        .multiplyBy( Matrix.rotationZ(Math.PI / 3) )
        .multiplyBy( Matrix.scaling(0.75, 0.75, 0.75) )
        .multiplyBy( Matrix.shearing(0.95, 0, 0, 0, 0, 0) )
    })
  }

  get topSphere() {
    return Sphere.create({
      color: Color.of(1.2, 0.1, 0.1),
      diffuse: 0.7,
      specular: 0.3,
      transform: Matrix.translation(-1, 2.4, -1)
        .multiplyBy( Matrix.rotationZ(Math.PI / 1.4) )
        .multiplyBy( Matrix.scaling(0.4, 0.4, 0.4) )
        .multiplyBy( Matrix.shearing(0.8, 0, 0, 0, 0, 0) )

    })
  }

  get middleSphere() {
    return Sphere.create({
      color: Color.of(0.1, 1, 0.5),
      diffuse: 0.7,
      specular: 0.3,
      transform: Matrix.translation(-0.2, 1, 0.5)
    })
  }

  get rightSphere() {
    return Sphere.create({
      color: Color.of(0.5, 0.5, 1),
      diffuse: 0.7,
      specular: 0.3,
      transform: Matrix.translation(1.5, 0.5, -0.5)
        .multiplyBy( Matrix.scaling(0.5, 0.5, 0.5) )
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
