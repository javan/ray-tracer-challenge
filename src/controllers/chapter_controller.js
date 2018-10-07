import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "content" ]

  async toggle() {
    this.content = this.open ? await this.getContent() : ""
  }

  // Private

  async getContent() {
    const response = await fetch(this.url)
    const html = await response.text()
    return html
  }

  get open() {
    return this.element.open
  }

  get url() {
    return `/chapters/${this.number}.html`
  }

  get number() {
    return this.data.get("number")
  }

  set content(html) {
    this.contentTarget.innerHTML = html
  }
}
