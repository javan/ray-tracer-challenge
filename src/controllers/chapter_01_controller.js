import { point, vector } from "../lib/tuples"
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "speedInput", "positionList" ]

  run(event) {
    event.preventDefault()
    this.reset()
    this.play()
  }

  // Private

  reset() {
    this.world = {
      gravity: vector(0, -0.1, 0),
      wind: vector(-0.01, 0, 0)
    }

    this.projectile = {
      position: point(1, 1, 0),
      velocity: vector(1, 1, 0).normalize.multiplyBy(this.speed)
    }

    this.positionListTarget.innerHTML = ""
  }

  play() {
    requestAnimationFrame(() => {
      this.renderProjectile()
      this.tick()
      if (this.projectile.position.y > 0) {
        this.play()
      } else {
        this.renderProjectile()
      }
    })
  }

  tick() {
    const { gravity, wind } = this.world
    const { position, velocity } = this.projectile
    this.projectile = {
      position: position.add(velocity),
      velocity: velocity.add(gravity).add(wind)
    }
  }

  renderProjectile() {
    const { x, y } = this.projectile.position
    const html = `<li>x: ${format(x)} y: ${format(y)}</li>`
    this.positionListTarget.insertAdjacentHTML("beforeend", html)
  }

  get speed() {
    return parseFloat(this.speedInputTarget.value)
  }
}

function format(number, precision = 12) {
  return number.toPrecision(precision).slice(0, precision).padEnd(precision, 0)
}
