import type { ControlField } from './utils/controls.ts'
import { mat4 } from 'gl-matrix'
import { Artist } from './utils/artist.ts'
import { resizeCanvasToDisplaySize } from './utils/canvas.ts'
import { Controls } from './utils/controls.ts'
import { getCachedCreatePlane } from './utils/plane.ts'
import { getFragmentShader, getVertexShader } from './utils/shaders.ts'

const MAX_NUM_NOISES = 8

export async function setupCanvas(canvas: HTMLCanvasElement, controlsForm: HTMLFormElement) {
  const controls = new Controls(controlsForm, [
    {
      label: 'Plane',
      fields: [
        { type: 'range', label: 'Subdivisions', name: 'subdivisions', initialValue: 100, min: 1, max: 255, step: 1, isRandomized: false },
        { type: 'range', label: 'Plane Scale X', name: 'planeScaleX', initialValue: 30, min: 1, max: 100, step: 1, isRandomized: false },
        { type: 'range', label: 'Plane Scale Y', name: 'planeScaleY', initialValue: 30, min: 1, max: 100, step: 1, isRandomized: false },
      ],
    },
    {
      label: 'Light',
      fields: [
        { type: 'range', label: 'Azimuth', name: 'lightAzimuth', initialValue: 0, min: 0, max: 2 * 3.14, step: 0.01, isRandomized: true },
        { type: 'range', label: 'Elevation', name: 'lightElevation', initialValue: 3.14 / 4, min: 0, max: 3.14 / 2, step: 0.01, isRandomized: true },
        { type: 'range', label: 'Normal Epsilon', name: 'normalEpsilon', initialValue: -2, min: -5, max: 0, step: 1, isRandomized: true },
      ],
    },
    {
      label: 'Camera',
      fields: [
        { type: 'range', label: 'Field of View (°)', name: 'fov', initialValue: 90, min: 0.5, max: 180, step: 0.5, isRandomized: false },
        { type: 'range', label: 'Near plane', name: 'near', initialValue: 5, min: 0.1, max: 10, step: 0.1, isRandomized: false },
        { type: 'range', label: 'Far plane', name: 'far', initialValue: 100, min: 1, max: 1000, step: 1, isRandomized: false },
        { type: 'range', label: 'Camera X position', name: 'camX', initialValue: 0, min: -50, max: 50, step: 0.1, isRandomized: false },
        { type: 'range', label: 'Camera Y position', name: 'camY', initialValue: -10, min: -50, max: 50, step: 0.1, isRandomized: false },
        { type: 'range', label: 'Camera Z position', name: 'camZ', initialValue: 50, min: -200, max: 200, step: 0.1, isRandomized: false },
        { type: 'range', label: 'Camera Angle (up-down)', name: 'camAngleX', initialValue: Math.PI / 4, min: -Math.PI, max: Math.PI, step: 0.01, isRandomized: false },
        { type: 'range', label: 'Camera Angle (left-right)', name: 'camAngleZ', initialValue: Math.PI / 8, min: -Math.PI, max: Math.PI, step: 0.01, isRandomized: false },
      ],
    },
    {
      label: 'Terrain',
      fields: [
        { type: 'range', label: 'Min height', name: 'minTerrainHeight', initialValue: 0, min: 0, max: 10, step: 0.1, isRandomized: true },
        { type: 'range', label: 'Max height', name: 'maxTerrainHeight', initialValue: 2, min: 0, max: 20, step: 0.1, isRandomized: true },
        { type: 'group', flex: 'row', fields: [
          { type: 'color', label: 'Color 1', name: 'color1', initialValue: '#23af3a', isRandomized: true },
          { type: 'color', label: 'Color 2', name: 'color2', initialValue: '#198660', isRandomized: true },
        ] },
      ],
    },
    {
      label: 'Noise',
      fields: Array.from({ length: MAX_NUM_NOISES }).fill(null).flatMap((_, index) => {
        const noiseOffsetX = 0
        const noiseOffsetY = 0
        const noiseFreqX = index === 0 ? 10 : 0
        const noiseFreqY = index === 0 ? 10 : 0
        const noiseContribution = index === 0 ? 5 : 0

        return [
          { type: 'range', label: `Noise ${index + 1} offset X`, name: `noise${index + 1}OffsetX`, initialValue: noiseOffsetX, min: -1, max: 1, step: 0.01, isRandomized: true },
          { type: 'range', label: `Noise ${index + 1} offset Y`, name: `noise${index + 1}OffsetY`, initialValue: noiseOffsetY, min: -1, max: 1, step: 0.01, isRandomized: true },
          { type: 'range', label: `Noise ${index + 1} freq X`, name: `noise${index + 1}FreqX`, initialValue: noiseFreqX, min: 0, max: 20, step: 0.01, isRandomized: true },
          { type: 'range', label: `Noise ${index + 1} freq Y`, name: `noise${index + 1}FreqY`, initialValue: noiseFreqY, min: 0, max: 20, step: 0.01, isRandomized: true },
          { type: 'range', label: `Noise ${index + 1} contribution`, name: `noise${index + 1}Contribution`, initialValue: noiseContribution, min: 0, max: 20, step: 0.01, isRandomized: true },
        ] satisfies ControlField[]
      }),
    },
  ] as const)

  const gl = canvas.getContext('webgl2')!

  const vertexShaderSource = await getVertexShader('3d-noise')
  const fragmentShaderSource = await getFragmentShader('3d-noise')

  const artist = new Artist(gl, vertexShaderSource, fragmentShaderSource)

  const positionAttributeLocation = gl.getAttribLocation(artist.program, 'a_position')

  gl.enable(gl.DEPTH_TEST)

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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(artist.program)
    gl.bindVertexArray(vao)

    const primitiveType = gl.TRIANGLES
    const arrayOffset = 0

    const fov = controls.getFloat('fov', 60) * (Math.PI / 180)
    const aspect = gl.canvas.width / gl.canvas.height
    const near = controls.getFloat('near', 0.1)
    const far = controls.getFloat('far', 100)
    const cameraPosition = [
      controls.getFloat('camX', 0),
      controls.getFloat('camY', 0),
      controls.getFloat('camZ', 5),
    ]
    const cameraAngleX = controls.getFloat('camAngleX', 0)
    const cameraAngleZ = controls.getFloat('camAngleZ', 0)

    const projection = mat4.create()
    mat4.perspective(projection, fov, aspect, near, far)

    const view = mat4.create()
    mat4.translate(view, view, [-cameraPosition[0], -cameraPosition[1], -cameraPosition[2]])
    mat4.rotateX(view, view, -cameraAngleX)
    mat4.rotateZ(view, view, -cameraAngleZ)

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

    const lightAzimuth = controls.getFloat('lightAzimuth', 0)
    const lightElevation = controls.getFloat('lightElevation', Math.PI / 4)
    const lightX = Math.cos(lightAzimuth) * Math.cos(lightElevation)
    const lightY = Math.sin(lightAzimuth) * Math.cos(lightElevation)
    const lightZ = Math.sin(lightElevation)

    artist.setUniform(
      '3f',
      'u_lightDirection',
      lightX,
      lightY,
      lightZ,
    )

    artist.setUniform('1f', 'u_normalEpsilon', 10 ** controls.getFloat('normalEpsilon', -2))

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
      '1f',
      'u_minTerrainHeight',
      controls.getFloat('minTerrainHeight', -2),
    )
    artist.setUniform(
      '1f',
      'u_maxTerrainHeight',
      controls.getFloat('maxTerrainHeight', 2),
    )

    artist.setUniform(
      '1fv',
      'u_noises',
      new Float32Array(
        Array.from({ length: MAX_NUM_NOISES }).fill(null).flatMap((_, index) => {
          return [
            controls.getFloat(`noise${index + 1}OffsetX`, 0),
            controls.getFloat(`noise${index + 1}OffsetY`, 0),
            controls.getFloat(`noise${index + 1}FreqX`, 5),
            controls.getFloat(`noise${index + 1}FreqY`, 5),
            controls.getFloat(`noise${index + 1}Contribution`, 0),
          ]
        }),
      ),
    )

    gl.drawElements(primitiveType, indices.length, gl.UNSIGNED_SHORT, arrayOffset)
  }

  window.addEventListener('resize', draw)
  controls.addEventListener('change', draw)

  document.getElementById('randomize')?.addEventListener('click', () => {
    controls.randomize()
    draw()
  })

  document.getElementById('delete')?.addEventListener('click', () => {
    controls.reset()
  })

  draw()
}
