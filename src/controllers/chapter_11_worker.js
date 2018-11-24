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
        Point(-2.6, 1.5, -3.9),
        Point(-0.6, 1, -0.8),
        Vector(0, 1, 0)
      )
    })
  }

  get world() {
    const world = World.of(this.floor, this.redSphere, this.blueGlassSphere, this.greenGlassSphere)
    world.light = new PointLight(Point(-4.9, 4.9, -1), Color.WHITE)
    return world
  }

  get floor() {
    const pattern = Checkers.of(Color.of(0.35, 0.35, 0.35), Color.of(0.65, 0.65, 0.65))
    pattern.transform = Matrix.transform({
      rotate: { y: 45 }
    })

    return Plane.create({
      pattern,
      reflective: 0.4,
      specular: 0
    })
  }

  get redSphere() {
    return Sphere.create({
      color: Color.of(1, 0.3, 0.2),
      specular: 0.4,
      shininess: 5,
      transform: Matrix.transform({
        move: { x: -0.6, y: 1, z: 0.6 },
      })
    })
  }

  get blueGlassSphere() {
    return Sphere.create({
      color: Color.of(0, 0, 0.2),
      ambient: 0,
      diffuse: 0.4,
      specular: 0.9,
      shininess: 300,
      reflective: 0.9,
      transparency: 0.9,
      refractive: 1.5,
      transform: Matrix.transform({
        scale: 0.7,
        move: { x: 0.6, y: 0.7, z: -0.6 },
      })
    })
  }

  get greenGlassSphere() {
    return Sphere.create({
      color: Color.of(0, 0.2, 0),
      ambient: 0,
      diffuse: 0.4,
      specular: 0.9,
      shininess: 300,
      reflective: 0.9,
      transparency: 0.9,
      refractive: 1.5,
      transform: Matrix.transform({
        scale: 0.5,
        move: { x: -0.7, y: 0.5, z: -0.8 },
      })
    })
  }
}
