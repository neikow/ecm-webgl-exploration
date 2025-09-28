import { mat4 } from 'gl-matrix'
import { Artist } from './utils/artist.ts'
import { resizeCanvasToDisplaySize } from './utils/canvas.ts'
import { Controls } from './utils/controls.ts'
import { getCachedCreatePlane } from './utils/plane.ts'
import { getFragmentShader, getVertexShader } from './utils/shaders.ts'

export async function setupCanvas(canvas: HTMLCanvasElement, controlsForm: HTMLFormElement) {
  const controls = new Controls(controlsForm)

  const gl = canvas.getContext('webgl2')!

  const vertexShaderSource = await getVertexShader('3d-noise')
  const fragmentShaderSource = await getFragmentShader('3d-noise')

  const artist = new Artist(gl, vertexShaderSource, fragmentShaderSource)

  const positionAttributeLocation = gl.getAttribLocation(artist.program, 'a_position')

  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.enableVertexAttribArray(positionAttributeLocation)

  const size = 3 // 2 components per iteration
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

  const createPlane = getCachedCreatePlane()

  function draw() {
    // eslint-disable-next-line no-console
    console.log('draw')

    resizeCanvasToDisplaySize(gl.canvas)

    const subdivisions = controls.getInt('subdivisions', 40)
    const { positions, indices } = createPlane(subdivisions)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(artist.program)
    gl.bindVertexArray(vao)

    const primitiveType = gl.TRIANGLES
    const arrayOffset = 0

    const fov = controls.getFloat('fov', 60) * (Math.PI / 180)
    const aspect = gl.canvas.width / gl.canvas.height
    const near = controls.getFloat('near', 0.1)
    const far = controls.getFloat('far', 100)
    const eyePosition = [
      controls.getFloat('camX', 0),
      controls.getFloat('camY', 0),
      controls.getFloat('camZ', 5),
    ]
    const target = [0, 0, 0]
    const up = [0, 0, 1]

    const projection = mat4.create()
    mat4.perspective(projection, fov, aspect, near, far)

    const view = mat4.create()
    mat4.lookAt(view, eyePosition, target, up)

    const viewProjection = mat4.create()
    mat4.multiply(viewProjection, projection, view)

    artist.setUniform(
      'Matrix4fv',
      'u_viewProjection',
      false,
      viewProjection,
    )

    artist.setUniform(
      '2f',
      'u_planeScale',
      controls.getFloat('planeScaleX', 10),
      controls.getFloat('planeScaleY', 10),
    )

    artist.setUniform(
      '1f',
      'u_noiseHeight',
      controls.getFloat('noiseHeight', 0.1),
    )

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

    gl.drawElements(primitiveType, indices.length, gl.UNSIGNED_SHORT, arrayOffset)
  }

  window.addEventListener('resize', draw)
  controls.addEventListener('change', draw)

  draw()
}
