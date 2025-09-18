import { resizeCanvasToDisplaySize } from './utils/canvas.ts'
import { createFragmentShader, createProgram, createVertexShader } from './utils/gl.ts'
import { getFragmentShader, getVertexShader } from './utils/shaders.ts'

export async function setupCanvas(canvas: HTMLCanvasElement, controls: HTMLFormElement) {
  const gl = canvas.getContext('webgl2')!

  const vertexShaderSource = await getVertexShader('hello_world')
  const fragmentShaderSource = await getFragmentShader('hello_world')

  const program = createProgram(
    gl,
    createVertexShader(gl, vertexShaderSource),
    createFragmentShader(gl, fragmentShaderSource),
  )!

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const positions = [
    0,
    0,
    0,
    0.5,
    0.7,
    0,
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

  resizeCanvasToDisplaySize(gl.canvas)

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.useProgram(program)
  gl.bindVertexArray(vao)

  const primitiveType = gl.TRIANGLES
  const arrayOffset = 0
  const count = 3
  gl.drawArrays(primitiveType, arrayOffset, count)
}
