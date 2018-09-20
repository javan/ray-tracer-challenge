import { Canvas, Color, Position } from "../models"
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "speedInput", "projectile" ]

  connect() {
    this.renderProjectile()
  }

  async renderProjectile() {
    await nextIdle()
    const element = this.projectileCanvas.toDOMCanvas()

    await nextFrame()
    this.projectileTarget.innerHTML = ""
    this.projectileTarget.appendChild(element)
  }

  downloadProjectile(event) {
    event.preventDefault()
    downloadCanvas(this.projectileCanvas, "projectile.ppm")
  }

  get projectileCanvas() {
    const canvas = new Canvas(900, 550)
    const red = Color.of(1.5, 0, 0)
    const positions = projectilePositions(this.speed)
    for (let { x, y } of positions) {
      if (canvas.hasPixelAt(x, y)) {
        y = Math.abs(canvas.height - y)
        canvas.writePixel(x, y, red)
      }
    }
    return canvas
  }

  get speed() {
    return parseFloat(this.speedInputTarget.value)
  }
}

function *projectilePositions(speed) {
  const gravity = Position.vector(0, -0.1, 0)
  const wind = Position.vector(-0.01, 0, 0)

  let position = Position.point(0, 1, 0)
  let velocity = Position.vector(1, 1.8, 0).normalize.multiplyBy(speed)

  while (position.y > 0) {
    yield {
      x: Math.floor(position.x),
      y: Math.floor(position.y)
    }
    position = position.add(velocity)
    velocity = velocity.add(gravity).add(wind)
  }
}

async function downloadCanvas(canvas, filename) {
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

function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

function nextIdle() {
  return new Promise(resolve => {
    window.requestIdleCallback
      ? requestIdleCallback(resolve)
      : setTimeout(resolve, 1)
  })
}
