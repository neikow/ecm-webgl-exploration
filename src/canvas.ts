import Stats from 'stats.js'

export function setupCanvas(canvas: HTMLCanvasElement, controls: HTMLFormElement) {
  const ctx = canvas.getContext('2d')!

  const stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)

  controls.addEventListener('input', () => {
    // Handle control changes here
  })

  const updateCanvasSize = () => {
    canvas.width = window.innerWidth * devicePixelRatio
    canvas.height = window.innerHeight * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#232331'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  function drawWhiteSquareOnGrayBackground(x: number, y: number) {
    ctx.beginPath()
    ctx.arc((canvas.width / devicePixelRatio + x) / 2, (canvas.height / devicePixelRatio + y) / 2, 80, 0, 2 * Math.PI)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
  }

  let t = 0
  let lastTime: DOMHighResTimeStamp = 0
  let currentAnimationFrame = 0

  function draw(currentTime: DOMHighResTimeStamp) {
    clearCanvas()

    const dT = currentTime - lastTime
    lastTime = currentTime

    stats.begin()

    const x = Math.cos(t) * 500 / devicePixelRatio
    const y = Math.sin(t) * 500 / devicePixelRatio

    drawWhiteSquareOnGrayBackground(x, y)

    stats.end()

    t += dT * 0.001
    currentAnimationFrame = requestAnimationFrame(draw)
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(currentAnimationFrame)
    updateCanvasSize()
    draw(performance.now())
  })

  updateCanvasSize()
  draw(performance.now())
}
