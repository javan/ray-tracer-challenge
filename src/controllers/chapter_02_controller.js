import { canvas } from "../lib/canvas"
import { color, point, vector } from "../lib/tuples"
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "speedInput", "projectile" ]

  connect() {
    this.renderProjectile()
  }

  downloadHelloWorld() {
    const c = canvas(5, 3)

    c.writePixel(0, 0, color(1.5, 0, 0))
    c.writePixel(2, 1, color(0, 0.5, 0))
    c.writePixel(4, 2, color(-0.5, 0, 1))

    downloadCanvas(c, "hello-world.ppm")
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
    const c = canvas(900, 550)
    const red = color(1.5, 0, 0)
    const positions = projectilePositions(this.speed)

    for (let { x, y } of positions) {
      y = Math.abs(550 - y)
      c.writePixel(x, y, red)
    }

    return c
  }

  get speed() {
    return parseFloat(this.speedInputTarget.value)
  }
}

function *projectilePositions(speed) {
  const gravity = vector(0, -0.1, 0)
  const wind = vector(-0.01, 0, 0)

  let position = point(0, 1, 0)
  let velocity = vector(1, 1.8, 0).normalize.multiplyBy(speed)

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
