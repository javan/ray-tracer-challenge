import { Controller } from "stimulus"
import { Canvas, Color, Material, Matrix } from "../models"
import { nextFrame, nextIdle, DOMCanvasProxy } from "../helpers"
import Worker from "./chapter_06_worker"

const CANVAS_SIZE = 175 * window.devicePixelRatio
const PIXEL_COUNT = CANVAS_SIZE * CANVAS_SIZE
const COLOR = Color.of(1, 0.2, 1)
const WORKER_COUNT = navigator.hardwareConcurrency || 2

export default class extends Controller {
  static targets = [ "transformInput", "ambientInput", "diffuseInput", "specularInput", "shininessInput", "preview", "stats" ]

  connect() {
    this.workers = Array.from({ length: WORKER_COUNT }, _ => new Worker)
    this.render()
  }

  disconnect() {
    this.workers.forEach(worker => worker.terminate())
  }

  // Actions

  async render() {
    await nextFrame()
    this.canvas = new DOMCanvasProxy(CANVAS_SIZE, CANVAS_SIZE)

    this.previewTarget.innerHTML = ""
    this.previewTarget.appendChild(this.canvas.element)

    await nextIdle()
    const stats = await this.writePixels()
    const { format } = new Intl.NumberFormat
    this.statsTarget.innerHTML = [
      `Rendered in ${format(stats.time)}ms using ${WORKER_COUNT} web workers.`,
      `Hit ${format(stats.pixelWriteCount)} out of ${format(PIXEL_COUNT)} pixels.`
    ].join("<br>")
  }

  async download(event) {
    const blob = this.canvas.toPPM().toBlob()
    const url = URL.createObjectURL(blob)
    event.currentTarget.href = url

    await nextFrame()
    URL.revokeObjectURL(url)
  }

  // Private

  writePixels() {
    return new Promise(resolve => {
      const startTime = performance.now()

      const { transform, ambient, diffuse, specular, shininess } = this
      const message = { canvasSize: CANVAS_SIZE, color: COLOR, transform, ambient, diffuse, specular, shininess }
      const batchSize = Math.floor(CANVAS_SIZE / WORKER_COUNT)

      let completedWorkerCount = 0
      let pixelWriteCount = 0

      this.workers.forEach((worker, index) => {
        const start = index * batchSize
        const end = start + batchSize
        worker.postMessage({ start, end, ...message })

        worker.onmessage = ({ data }) => {
          if (data.pixels) {
            data.pixels.forEach(({ x, y, color }) => {
              this.canvas.writePixel(x, y, Color.of(...color))
              pixelWriteCount++
            })
          } else {
            completedWorkerCount++
            if (completedWorkerCount == WORKER_COUNT) {
              const time = performance.now() - startTime
              resolve({ time, pixelWriteCount })
            }
          }
        }
      })
    })
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
