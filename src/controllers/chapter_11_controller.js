import { Controller } from "stimulus"
import { nextFrame, createCanvasElement } from "../helpers"
import Worker from "./chapter_11_worker"

const WIDTH  = 200 * window.devicePixelRatio
const HEIGHT = 150 * window.devicePixelRatio
const PIXEL_COUNT = WIDTH * HEIGHT
const WORKER_COUNT = 10

export default class extends Controller {
  static targets = [ "preview", "stats" ]

  connect() {
    this.workers = Array.from({ length: WORKER_COUNT }, _ => new Worker)
    this.render()
  }

  disconnect() {
    this.workers.forEach(worker => worker.terminate())
  }

  // Actions

  async render() {
    const element = createCanvasElement(WIDTH, HEIGHT)

    await nextFrame()
    this.previewTarget.innerHTML = ""
    this.previewTarget.appendChild(element)

    await nextFrame()
    const stats = await this.writePixels(element)

    await nextFrame()
    const { format } = new Intl.NumberFormat
    this.statsTarget.style.width = element.style.width
    this.statsTarget.textContent = `
      Rendered ${format(PIXEL_COUNT)} pixels
      in ${format(stats.time)}ms
      using ${WORKER_COUNT} web workers.
    `
  }

  // Private

  writePixels(canvas) {
    return new Promise(resolve => {
      const startTime = performance.now()
      const context = canvas.getContext("2d")
      const batchSize = Math.floor(WIDTH / WORKER_COUNT)
      let completedWorkerCount = 0

      this.workers.forEach((worker, index) => {
        const startX = index * batchSize
        const endX = startX + batchSize
        worker.postMessage({ startX, endX, width: WIDTH, height: HEIGHT })

        worker.onmessage = async ({ data }) => {
          if (data.colors) {
            const colors = new Uint8ClampedArray(data.colors)
            const imageData = new ImageData(colors, data.width, HEIGHT)
            await nextFrame()
            context.putImageData(imageData, data.x, 0)
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
