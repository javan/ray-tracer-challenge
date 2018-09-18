import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "chapter" ]

  connect() {
    this.lastChapterTarget.open = true
  }

  closeOthers({ target }) {
    if (target.open) {
      this.chapterTargets.forEach(element => element.open = element == target)
    }
  }

  get lastChapterTarget() {
    return this.chapterTargets.slice(-1)[0]
  }
}
