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
