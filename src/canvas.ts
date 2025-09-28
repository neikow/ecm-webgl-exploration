import { Artist } from './utils/artist.ts'
import { resizeCanvasToDisplaySize } from './utils/canvas.ts'
import { Controls } from './utils/controls.ts'
import { getFragmentShader, getVertexShader } from './utils/shaders.ts'

export async function setupCanvas(canvas: HTMLCanvasElement, controlsForm: HTMLFormElement) {
  const controls = new Controls(controlsForm)

  const gl = canvas.getContext('webgl2')!

  const vertexShaderSource = await getVertexShader('2d-noise')
  const fragmentShaderSource = await getFragmentShader('2d-noise')

  const artist = new Artist(gl, vertexShaderSource, fragmentShaderSource)

  const positionAttributeLocation = gl.getAttribLocation(artist.program, 'a_position')

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

  function draw() {
    resizeCanvasToDisplaySize(gl.canvas)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(artist.program)
    gl.bindVertexArray(vao)

    const primitiveType = gl.TRIANGLES
    const arrayOffset = 0
    const count = 6

    artist.setUniform(
      '3f',
      'u_color1',
      ...controls.getColor('color1'),
    )
    artist.setUniform(
      '3f',
      'u_color2',
      ...controls.getColor('color2'),
    )

    artist.setUniform(
      '2f',
      'u_resolution',
      gl.canvas.width,
      gl.canvas.height,
    )

    artist.setUniform(
      '2f',
      'u_positionOffset',
      (controls.getFloat('posOffsetX', 0.5) * 2 - 1) * 10,
      (controls.getFloat('posOffsetY', 0.5) * 2 - 1) * 10,
    )

    artist.setUniform(
      '2f',
      'u_noiseMultiplier',
      controls.getFloat('noiseMulX', 0.5) * 30,
      controls.getFloat('noiseMulY', 0.5) * 40,
    )

    gl.drawArrays(primitiveType, arrayOffset, count)
  }

  window.addEventListener('resize', draw)
  controls.addEventListener('change', draw)

  draw()
}
