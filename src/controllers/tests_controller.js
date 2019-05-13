import { Controller } from "stimulus"
import { nextIdle, nextFrame } from "../helpers"

export default class extends Controller {
  static targets = [ "summary", "output" ]

  async initialize() {
    await nextIdle()
    const response = await fetch(this.data.get("url"))
    const text = await response.text()

    await nextFrame()
    this.outputTarget.innerHTML = formatTestOutput(text)

    const match = text.match(/\d+ tests passed/)
    if (match) this.summaryTarget.textContent = match[0]

    this.element.hidden = false
  }
}

function formatTestOutput(text) {
  const element = document.createElement("div")
  element.textContent = text
  return element.innerHTML
    .replace(/^\s*/mg, "")
    .replace(/yarn run[^\n]*\n/, "")
    .replace(/\$ ava [^\n]*\n/, "")
    .replace(/\d+ tests passed[\s\S]*/, "")
    .replace(/✔/g, `<span style="color: green">✔</span>`)
    .replace(/✖/g, `<span style="color: red">✖</span>`)
}
