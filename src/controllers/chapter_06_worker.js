onmessage = ({ data }) => {
  const sphere = Sphere.create({
    color: Color.from(data.color),
    ambient: data.ambient,
    diffuse: data.diffuse,
    specular: data.specular,
    shininess: data.shininess,
    transform: Matrix.from(data.transform),
  })

  let { start, end } = data
  function sendBatch() {
    postMessage({ pixels: getPixels(sphere, data.canvasSize, start, ++start) })

    if (start < end) {
      setTimeout(sendBatch)
    } else {
      postMessage({}) // Done
    }
  }
  sendBatch()
}

function getPixels(sphere, canvasSize, start, end) {
  const lightPosition = Point(-10, 10, -10)
  const lightColor = Color.WHITE
  const light = new PointLight(lightPosition, lightColor)

  const rayOrigin = Point(0, 0, -5)

  const wallZ = 10
  const wallSize = 7.0

  const pixelSize = wallSize / canvasSize
  const halfSize = wallSize / 2

  const pixels = []
  for (let y = 0; y < canvasSize; y++) {
    const worldY = halfSize - pixelSize * y
    for (let x = start; x < end; x++) {
      const worldX = -halfSize + pixelSize * x
      const position = Point(worldX, worldY, wallZ)
      const ray = new Ray(rayOrigin, position.subtract(rayOrigin).normalize)
      const { hit } = ray.intersect(sphere)
      if (hit) {
        const point = ray.position(hit.t)
        const normalv = sphere.normalAt(point)
        const eyev = ray.direction.negate
        const color = hit.object.material.lighting({ light, point, eyev, normalv })
        pixels.push({ x, y, color })
      }
    }
  }
  return pixels
}
