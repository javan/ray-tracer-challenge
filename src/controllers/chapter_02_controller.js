import { Canvas, Color, Position } from "../models"
import { downloadCanvas, createElementForCanvas, nextFrame, nextIdle } from "../helpers"
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "speedInput", "preview" ]

  connect() {
    this.render()
  }

  async render() {
    await nextIdle()
    const element = createElementForCanvas(this.canvas)

    await nextFrame()
    this.previewTarget.innerHTML = ""
    this.previewTarget.appendChild(element)
  }

  download(event) {
    event.preventDefault()
    downloadCanvas(this.canvas, "projectile.ppm")
  }

  get canvas() {
    const canvas = new Canvas(900, 550)
    const red = Color.of(1.5, 0, 0)

    for (let { x, y } of positions(this.speed)) {
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

function *positions(speed) {
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
