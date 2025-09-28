import { resizeCanvasToDisplaySize } from './utils/canvas.ts'
import { createFragmentShader, createProgram, createVertexShader } from './utils/gl.ts'
import { getFragmentShader, getVertexShader } from './utils/shaders.ts'

export async function setupCanvas(canvas: HTMLCanvasElement, controls: HTMLFormElement) {
  function getControlValueFloat(name: string, defaultValue: number) {
    const element = controls.elements.namedItem(name) as HTMLInputElement
    if (element.type === 'checkbox') {
      return element.checked ? 1 : 0
    }
    if (element.type === 'color') {
      throw new Error('Color type not supported for float value')
    }
    return element ? Number.parseFloat(element.value) : defaultValue
  }

  function getControlValueColor(name: string) {
    const element = controls.elements.namedItem(name) as HTMLInputElement
    if (!element) {
      throw new Error('Element not found')
    }
    if (element.type === 'color') {
      const hex = element.value
      const r = Number.parseInt(hex.slice(1, 3), 16) / 255
      const g = Number.parseInt(hex.slice(3, 5), 16) / 255
      const b = Number.parseInt(hex.slice(5, 7), 16) / 255
      return [r, g, b]
    }
    throw new Error('Not a color input')
  }

  const gl = canvas.getContext('webgl2')!

  const vertexShaderSource = await getVertexShader('2d-noise')
  const fragmentShaderSource = await getFragmentShader('2d-noise')

  const program = createProgram(
    gl,
    createVertexShader(gl, vertexShaderSource),
    createFragmentShader(gl, fragmentShaderSource),
  )!

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const positions = [
    -1,
    -1,

    -1,
    1,

    1,
    1,

    1,
    -1,

    -1,
    -1,

    1,
    1,
  ]

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  gl.enableVertexAttribArray(positionAttributeLocation)

  const size = 2 // 2 components per iteration
  const type = gl.FLOAT // the data is 32bit floats
  const normalize = false // don't normalize the data
  const stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position
  const offset = 0 // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  )

  const noiseMultiplierPosition = gl.getUniformLocation(program, 'u_noiseMultiplier')
  const positionOffsetLocation = gl.getUniformLocation(program, 'u_positionOffset')
  const color1Location = gl.getUniformLocation(program, 'u_color1')
  const color2Location = gl.getUniformLocation(program, 'u_color2')

  function draw() {
    resizeCanvasToDisplaySize(gl.canvas)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindVertexArray(vao)

    const primitiveType = gl.TRIANGLES
    const arrayOffset = 0
    const count = 6

    const [r1, g1, b1] = getControlValueColor('color1')
    const [r2, g2, b2] = getControlValueColor('color2')

    gl.uniform3f(color1Location, r1, g1, b1)
    gl.uniform3f(color2Location, r2, g2, b2)

    gl.uniform2f(
      positionOffsetLocation,
      (getControlValueFloat('posOffsetX', 0.5) * 2 - 1) * 10,
      (getControlValueFloat('posOffsetY', 0.5) * 2 - 1) * 10,
    )

    gl.uniform2f(
      noiseMultiplierPosition,
      getControlValueFloat('noiseMulX', 0.5) * 30,
      getControlValueFloat('noiseMulY', 0.5) * 40,
    )

    gl.drawArrays(primitiveType, arrayOffset, count)
  }

  window.addEventListener('resize', draw)
  controls.addEventListener('input', draw)

  draw()
}
