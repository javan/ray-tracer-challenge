import { Canvas, Color, Material, Matrix, PointLight, Position, Ray, Sphere } from "../models"
import { nextFrame, nextIdle, DOMCanvasProxy } from "../helpers"
import { Controller } from "stimulus"

const CANVAS_SIZE = 175 * window.devicePixelRatio
const COLOR = Color.of(1, 0.2, 1)

export default class extends Controller {
  static targets = [ "transformInput", "ambientInput", "diffuseInput", "specularInput", "shininessInput", "preview" ]

  connect() {
    const workerCount = navigator.hardwareConcurrency || 2
    this.workers = Array.from({ length: workerCount }, _ => new Worker("chapter_06_worker.js"))
    this.render()
  }

  disconnect() {
    this.workers.forEach(worker => worker.terminate())
  }

  async render() {
    await nextFrame()
    this.canvas = new DOMCanvasProxy(CANVAS_SIZE, CANVAS_SIZE)

    this.previewTarget.innerHTML = ""
    this.previewTarget.appendChild(this.canvas.element)

    await nextIdle()
    this.eachPixel(pixel => this.canvas.writePixel(...pixel))
  }

  eachPixel(callback) {
    const { transform, ambient, diffuse, specular, shininess } = this
    const message = { canvasSize: CANVAS_SIZE, color: COLOR, transform, ambient, diffuse, specular, shininess }
    const batchSize = CANVAS_SIZE / this.workers.length

    this.workers.forEach((worker, index) => {
      const start = index * batchSize
      const end = start + batchSize
      worker.postMessage({ start, end, ...message })

      worker.onmessage = ({ data }) => {
        data.pixels.forEach(({ x, y, color }) => {
          callback([ x, y, Color.from(color) ])
        })
      }
    })
  }

  async download(event) {
    const blob = this.canvas.toPPM().toBlob()
    const url = URL.createObjectURL(blob)
    event.currentTarget.href = url

    await nextFrame()
    URL.revokeObjectURL(url)
  }

  get transform() {
    return this.transforms.reduce((result, value) => result.multiplyBy(value))
  }

  get transforms() {
    const inputs = this.transformInputTargets.filter(e => e.checked)
    const transforms = inputs.map(e => TRANSFORMS[e.value])
    return [Matrix.identity, ...transforms]
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
