export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement | OffscreenCanvas) {
  if (canvas instanceof OffscreenCanvas) {
    return false
  }

  const width = canvas.clientWidth
  const height = canvas.clientHeight
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true
  }

  return false
}
