import { Color, Material, Matrix, PointLight, Position, Ray, Sphere } from "../models"
import { nextFrame, nextIdle, DOMCanvasProxy } from "../helpers"
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "transformInput", "ambientInput", "diffuseInput", "specularInput", "shininessInput", "preview" ]

  connect() {
    this.render()
  }

  async render() {
    await nextIdle()
    const { element } = this.canvas

    await nextFrame()
    this.previewTarget.innerHTML = ""
    this.previewTarget.appendChild(element)
  }

  async download(event) {
    const blob = this.canvas.toPPM().toBlob()
    const url = URL.createObjectURL(blob)
    event.currentTarget.href = url

    await nextFrame()
    URL.revokeObjectURL(url)
  }

  get canvas() {
    const sphere = new Sphere
    sphere.transform = this.transform
    sphere.material = this.material

    const lightPosition = Position.point(-10, 10, -10)
    const lightColor = Color.of(1, 1, 1)
    const light = new PointLight(lightPosition, lightColor)

    const rayOrigin = Position.point(0, 0, -5)

    const wallZ = 10
    const wallSize = 7.0

    const canvasSize = 150
    const pixelSize = wallSize / canvasSize
    const halfSize = wallSize / 2

    const canvas = new DOMCanvasProxy(canvasSize, canvasSize)

    for (let y = 0; y < canvasSize; y++) {
      const worldY = halfSize - pixelSize * y
      for (let x = 0; x < canvasSize; x++) {
        const worldX = -halfSize + pixelSize * x
        const position = Position.point(worldX, worldY, wallZ)
        const ray = new Ray(rayOrigin, position.subtract(rayOrigin).normalize)
        const { hit } = ray.intersect(sphere)
        if (hit) {
          const point = ray.position(hit.t)
          const normal = sphere.normalAt(point)
          const eye = ray.direction.negate
          const color = hit.object.material.lighting(light, point, eye, normal)
          canvas.writePixel(x, y, color)
        }
      }
    }

    return canvas
  }

  get transform() {
    return this.transforms.reduce((result, value) => result.multiplyBy(value))
  }

  get transforms() {
    const inputs = this.transformInputTargets.filter(e => e.checked)
    const transforms = inputs.map(e => TRANSFORMS[e.value])
    return [Matrix.identity, ...transforms]
  }

  get material() {
    const material = new Material
    material.color = Color.of(1, 0.2, 1)
    material.ambient = this.ambient
    material.diffuse = this.diffuse
    material.specular = this.specular
    material.shininess = this.shininess
    return material
  }

  get ambient() {
    return parseFloat(this.ambientInputTarget.value)
  }

  get diffuse() {
    return parseFloat(this.diffuseInputTarget.value)
  }

  get specular() {
    return parseFloat(this.specularInputTarget.value)
  }

  get shininess() {
    return parseInt(this.shininessInputTarget.value)
  }
}

const TRANSFORMS = {
  shrinkY: Matrix.scaling(1, 0.5, 1),
  shrinkX: Matrix.scaling(0.5, 1, 1),
  rotate: Matrix.rotationZ(Math.PI / 4),
  skew: Matrix.shearing(1, 0, 0, 0, 0, 0)
}
