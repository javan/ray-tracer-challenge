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
      view: Math.PI / 1.5,
      transform: Matrix.viewTransform(
        Point(0, 2, -5),
        Point(0, 2, 0),
        Vector(0, 1, 0)
      )
    })
  }

  get world() {
    const world = World.of(...this.walls, ...this.shapes)
    world.light = new PointLight(Point(5, 1, -6), Color.of(1.6, 1.6, 1.6))
    return world
  }

  get walls() {
    const material = {
      color: Color.of(1, 0.9, 0.9),
      ambient: 0.05,
      diffuse: 0.6,
      specular: 0,
    }
    return [
      Plane.create({
        ...material,
        diffuse: 1.2,
        ambient: 0.1,
      }),
      Plane.create({
        ...material,
        transform: Matrix.translation(0, 0, 10)
          .multiplyBy( Matrix.rotationX(Math.PI / 2) )
      }),
      Plane.create({
        ...material,
        transform: Matrix.translation(-8, 0, 10)
          .multiplyBy( Matrix.rotationY(90/180 * -Math.PI) )
          .multiplyBy( Matrix.rotationX(Math.PI / 2) )
      })
    ]
  }


  get shapes() {
    return [
      Sphere.create({
        color: Color.of(0.1, 1, 0.5),
        diffuse: 0.7,
        specular: 0.3,
        transform: Matrix.translation(1.5, 0, -1)
          .multiplyBy( Matrix.rotationZ(Math.PI / 2) )
          .multiplyBy( Matrix.scaling(0.4, 2.2, 1.8) )
      }),
      Sphere.create({
        color: Color.of(0.1, 1, 0.5),
        diffuse: 0.5,
        specular: 0.3,
        transform: Matrix.translation(1.5, 0.4, -1)
          .multiplyBy( Matrix.rotationZ(Math.PI / 2) )
          .multiplyBy( Matrix.rotationX(Math.PI / 4) )
          .multiplyBy( Matrix.scaling(1.6, 0.2, 1.6) )
      }),
      Sphere.create({
        color: Color.of(0.1, 1, 0.5),
        diffuse: 0.5,
        specular: 0.3,
        transform: Matrix.translation(1.5, 0.4, -1)
          .multiplyBy( Matrix.rotationZ(Math.PI / 2) )
          .multiplyBy( Matrix.rotationX(-Math.PI / 3) )
          .multiplyBy( Matrix.scaling(5, 0.2, 1.6) )
      })
    ]
  }
}
