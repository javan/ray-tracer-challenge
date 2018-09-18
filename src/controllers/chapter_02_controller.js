import { canvas } from "../lib/canvas"
import { color } from "../lib/tuples"
import { Controller } from "stimulus"

export default class extends Controller {
  download() {
    const c = canvas(5, 3)
    c.writePixel(0, 0, color(1.5, 0, 0))
    c.writePixel(2, 1, color(0, 0.5, 0))
    c.writePixel(4, 2, color(-0.5, 0, 1))

    downloadCanvas(c)
  }
}

function downloadCanvas(canvas, filename = "canvas.ppm") {
  const blob = new Blob([canvas.toPPM()], { type: "image/x-portable-pixmap" })

  const element = document.createElement("a")
  element.href = URL.createObjectURL(blob)
  element.download = filename
  element.style = "position: absolute; left: -9999px;"

  document.body.appendChild(element)
  element.click()

  Promise.resolve().then(() => {
    element.remove()
    URL.revokeObjectURL(element.href)
  })
}
