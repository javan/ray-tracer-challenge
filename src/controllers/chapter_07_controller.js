import { Color } from "../models"
import { nextFrame, DOMCanvasProxy } from "../helpers"
import { Controller } from "stimulus"

const HSIZE = 250 * window.devicePixelRatio
const VSIZE = 150 * window.devicePixelRatio
const PIXEL_COUNT = HSIZE * VSIZE
const WORKER_COUNT = navigator.hardwareConcurrency || 4

export default class extends Controller {
  static targets = [ "preview", "stats" ]

  connect() {
    this.workers = Array.from({ length: WORKER_COUNT }, _ => new Worker("chapter_07_worker.js"))
    this.render()
  }

  disconnect() {
    this.workers.forEach(worker => worker.terminate())
  }

  // Actions

  async render() {
    await nextFrame()
    this.canvas = new DOMCanvasProxy(HSIZE, VSIZE)
    this.previewTarget.innerHTML = ""
    this.previewTarget.appendChild(this.canvas.element)

    await nextFrame()
    const stats = await this.writePixels()

    await nextFrame()
    const { format } = new Intl.NumberFormat
    this.statsTarget.style.width = this.canvas.element.style.width
    this.statsTarget.textContent = `
      Rendered ${format(PIXEL_COUNT)} pixels
      in ${format(stats.time)}ms
      using ${WORKER_COUNT} web workers.
    `
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
      const message = { hsize: HSIZE, vsize: VSIZE }
      const batchSize = Math.floor(HSIZE / WORKER_COUNT)
      let completedWorkerCount = 0

      this.workers.forEach((worker, index) => {
        const startX = index * batchSize
        const endX = startX + batchSize
        worker.postMessage({ startX, endX, ...message })

        worker.onmessage = ({ data }) => {
          if (data.pixels) {
            data.pixels.forEach(({ x, y, color }) => {
              this.canvas.writePixel(x, y, Color.of(...color))
            })
          } else {
            completedWorkerCount++
            if (completedWorkerCount == WORKER_COUNT) {
              const time = performance.now() - startTime
              resolve({ time })
            }
          }
        }
      })
    })
  }
}
