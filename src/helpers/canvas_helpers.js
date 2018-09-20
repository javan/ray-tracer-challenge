import { nextFrame } from "./timing_helpers"

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
