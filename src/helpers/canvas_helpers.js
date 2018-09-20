import { nextFrame } from "./timing_helpers"

export async function downloadCanvas(canvas, filename) {
  const blob = new Blob([ canvas.toPPM() ], { type: "image/x-portable-pixmap" })
  const element = document.createElement("a")

  element.href = URL.createObjectURL(blob)
  element.download = filename
  element.style = "position: absolute; left: -9999px;"

  document.body.appendChild(element)
  element.click()

  await nextFrame()
  element.remove()
  URL.revokeObjectURL(element.href)
}

export function createElementForCanvas(canvas) {
  const { width, height, fillColor } = canvas
  const element = document.createElement("canvas")
  const context = element.getContext("2d")

  element.width = width
  element.height = height

  context.fillStyle = `rgb(${fillColor.rgb})`
  context.fillRect(0, 0, width, height)

  canvas.eachDirtyPixel((pixel, x, y) => {
    const imageData = new ImageData(pixel.rgba, 1, 1)
    context.putImageData(imageData, x, y)
  })

  return element
}
