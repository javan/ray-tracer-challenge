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
    world.light = new PointLight(Point(-3, 6, -8), Color.WHITE.multiplyBy(1.2))
    return world
  }

  get floor() {
    const pattern = Checkers.of(Color.WHITE, Color.BLACK)
    pattern.transform = Matrix.transform({
      rotate: { y: 45 },
      scale: 2,
    })

    return Plane.create({
      pattern,
      diffuse: 0.7,
      ambient: 0.3,
    })
  }

  get wall() {
    const pattern = Ring.of(Color.WHITE, Color.of(1, 0, 0))
    return Plane.create({
      pattern,
      diffuse: 0.7,
      ambient: 0.2,
      transform: Matrix.transform({
        rotate: { x: 90 },
        move: { z: 5 },
      })
    })
  }

  get sphere() {
    const pattern = Stripe.of(Color.of(1, 0.5, 0), Color.of(1, 0.3, 0))
    pattern.transform = Matrix.transform({
      rotate: { z: 90 },
      scale: 0.05
    })

    return Sphere.create({
      pattern,
      ambient: 0.15,
      transform: Matrix.transform({
        scale: { x: 0.5, y: 4.5, z: 0.5 },
        move: { x: 1.5 },
      })
    })
  }
}
