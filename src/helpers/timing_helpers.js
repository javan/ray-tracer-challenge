export function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

export function nextIdle() {
  return new Promise(resolve => {
    window.requestIdleCallback
      ? requestIdleCallback(resolve)
      : setTimeout(resolve, 1)
  })
}
