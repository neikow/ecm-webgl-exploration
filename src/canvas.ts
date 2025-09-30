import { mat4, vec3 } from 'gl-matrix'
import { Artist } from './utils/artist.ts'
import { resizeCanvasToDisplaySize } from './utils/canvas.ts'
import { Controls } from './utils/controls.ts'
import { getCachedCreatePlane } from './utils/plane.ts'
import { getFragmentShader, getVertexShader } from './utils/shaders.ts'

const MAX_NUM_NOISES = 16

export async function setupCanvas(canvas: HTMLCanvasElement, controlsForm: HTMLFormElement) {
  const controls = new Controls(controlsForm, [
    {
      label: 'Plane',
      fields: [
        { type: 'range', label: 'Subdivisions', name: 'subdivisions', initialValue: 100, min: 1, max: 255, step: 1 },
        { type: 'range', label: 'Plane Scale X', name: 'planeScaleX', initialValue: 30, min: 1, max: 100, step: 1 },
        { type: 'range', label: 'Plane Scale Y', name: 'planeScaleY', initialValue: 30, min: 1, max: 100, step: 1 },
      ],
    },
    {
      label: 'Light',
      fields: [
        { type: 'range', label: 'Azimuth', name: 'lightAzimuth', initialValue: 0, min: 0, max: 2 * 3.14, step: 0.01 },
        { type: 'range', label: 'Elevation', name: 'lightElevation', initialValue: 3.14 / 4, min: 0, max: 3.14 / 2, step: 0.01 },
        { type: 'range', label: 'Distance', name: 'lightDistance', initialValue: 10, min: 1, max: 100, step: 1 },
        { type: 'range', label: 'Projection Width', name: 'projectionWidth', initialValue: 20, min: 1, max: 100, step: 1 },
        { type: 'range', label: 'Projection Height', name: 'projectionHeight', initialValue: 20, min: 1, max: 100, step: 1 },
        { type: 'range', label: 'Light Near plane', name: 'lightNear', initialValue: 1, min: 0.1, max: 100, step: 0.1 },
        { type: 'range', label: 'Light Far plane', name: 'lightFar', initialValue: 100, min: 1, max: 1000, step: 1 },
        { type: 'range', label: 'Normal Epsilon', name: 'normalEpsilon', initialValue: -2, min: -5, max: 0, step: 1 },
      ],
    },
    {
      label: 'Camera',
      fields: [
        { type: 'range', label: 'Field of View (°)', name: 'fov', initialValue: 90, min: 0.5, max: 180, step: 0.5 },
        { type: 'range', label: 'Near plane', name: 'near', initialValue: 5, min: 0.1, max: 10, step: 0.1 },
        { type: 'range', label: 'Far plane', name: 'far', initialValue: 30, min: 1, max: 100, step: 1 },
        { type: 'range', label: 'Camera X position', name: 'camX', initialValue: 5, min: -10, max: 20, step: 0.1 },
        { type: 'range', label: 'Camera Y position', name: 'camY', initialValue: 5, min: -10, max: 20, step: 0.1 },
        { type: 'range', label: 'Camera Z position', name: 'camZ', initialValue: 10, min: -20, max: 80, step: 0.1 },
      ],
    },
    {
      label: 'Terrain',
      fields: [
        { type: 'range', label: 'Min height', name: 'minTerrainHeight', initialValue: 0, min: 0, max: 10, step: 0.1 },
        { type: 'range', label: 'Max height', name: 'maxTerrainHeight', initialValue: 2, min: 0, max: 20, step: 0.1 },
        { type: 'group', flex: 'row', fields: [
          { type: 'color', label: 'Color 1', name: 'color1', initialValue: '#23af3a' },
          { type: 'color', label: 'Color 2', name: 'color2', initialValue: '#198660' },
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
          { type: 'range', label: `Noise ${index + 1} offset X`, name: `noise${index + 1}OffsetX`, initialValue: noiseOffsetX, min: -1, max: 1, step: 0.01 },
          { type: 'range', label: `Noise ${index + 1} offset Y`, name: `noise${index + 1}OffsetY`, initialValue: noiseOffsetY, min: -1, max: 1, step: 0.01 },
          { type: 'range', label: `Noise ${index + 1} freq X`, name: `noise${index + 1}FreqX`, initialValue: noiseFreqX, min: 0, max: 20, step: 0.01 },
          { type: 'range', label: `Noise ${index + 1} freq Y`, name: `noise${index + 1}FreqY`, initialValue: noiseFreqY, min: 0, max: 20, step: 0.01 },
          { type: 'range', label: `Noise ${index + 1} contribution`, name: `noise${index + 1}Contribution`, initialValue: noiseContribution, min: 0, max: 20, step: 0.01 },
        ]
      }),
    },
  ] as const)

  const gl = canvas.getContext('webgl2')!

  resizeCanvasToDisplaySize(gl.canvas)
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

  const artist = new Artist(gl, {
    main: {
      vertex: await getVertexShader('3d-noise'),
      fragment: await getFragmentShader('3d-noise'),
    },
  })

  const createPlane = getCachedCreatePlane()

  const depthTexture = gl.createTexture()
  const depthTextureSize = 512
  gl.bindTexture(gl.TEXTURE_2D, depthTexture)
  gl.texImage2D(
    gl.TEXTURE_2D, // target
    0, // mip level
    gl.DEPTH_COMPONENT32F, // internal format
    depthTextureSize, // width
    depthTextureSize, // height
    0, // border
    gl.DEPTH_COMPONENT, // format
    gl.FLOAT, // type
    null,
  ) // data
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const depthFramebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER, // target
    gl.DEPTH_ATTACHMENT, // attachment point
    gl.TEXTURE_2D, // texture target
    depthTexture, // texture
    0,
  ) // mip level

  const target = [0, 0, 0]
  const up = [0, 0, 1]

  function computeProjectionMatrix() {
    const fov = controls.getFloat('fov', 60) * (Math.PI / 180)
    const aspect = gl.canvas.width / gl.canvas.height
    const near = controls.getFloat('near', 0.1)
    const far = controls.getFloat('far', 100)

    const projectionMatrix = mat4.create()
    mat4.perspective(projectionMatrix, fov, aspect, near, far)

    return projectionMatrix
  }

  function computeEyePosition() {
    return [
      controls.getFloat('camX', 0),
      controls.getFloat('camY', 0),
      controls.getFloat('camZ', 5),
    ]
  }

  function computeViewMatrix() {
    const eyePosition = computeEyePosition()
    const view = mat4.create()
    mat4.lookAt(view, eyePosition, target, up)
    return view
  }

  function computeLightPosition() {
    const lightDistance = controls.getFloat('lightDistance', 10)
    const lightAzimuth = controls.getFloat('lightAzimuth', 0)
    const lightElevation = controls.getFloat('lightElevation', Math.PI / 4)
    const x = Math.cos(lightAzimuth) * Math.cos(lightElevation) * lightDistance
    const y = Math.sin(lightAzimuth) * Math.cos(lightElevation) * lightDistance
    const z = Math.sin(lightElevation) * lightDistance
    return [x, y, z]
  }

  function draw() {
    artist.useProgram('main')

    resizeCanvasToDisplaySize(gl.canvas)

    const lightWorldMatrix = mat4.create()
    mat4.lookAt(lightWorldMatrix, computeLightPosition(), target, up)

    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer)
    gl.viewport(0, 0, depthTextureSize, depthTextureSize)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const lightProjectionMatrix = mat4.create()
    mat4.ortho(
      lightProjectionMatrix,
      -controls.getFloat('projectionWidth', 20) / 2,
      controls.getFloat('projectionWidth', 20) / 2,
      -controls.getFloat('projectionHeight', 20) / 2,
      controls.getFloat('projectionHeight', 20) / 2,
      controls.getFloat('lightNear', 1),
      controls.getFloat('lightFar', 100),
    )

    // draw the scene from the light's point of view
    // to the depth texture
    // we don't need the texture matrix because we're
    // only interested in the depth values

    const I4 = mat4.create()
    mat4.identity(I4)
    drawScene(lightProjectionMatrix, lightWorldMatrix, I4, lightWorldMatrix)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const textureMatrix = mat4.create()
    mat4.identity(textureMatrix)
    const translateVec = vec3.fromValues(0.5, 0.5, 0.5)
    mat4.scale(textureMatrix, textureMatrix, translateVec)
    mat4.multiply(textureMatrix, textureMatrix, lightProjectionMatrix)
    // use the inverse of this world matrix to make
    // a matrix that will transform other positions
    // to be relative this world space.
    mat4.multiply(textureMatrix, textureMatrix, lightWorldMatrix)

    const projectionMatrix = computeProjectionMatrix()
    const viewMatrix = computeViewMatrix()

    drawScene(projectionMatrix, viewMatrix, textureMatrix, lightWorldMatrix)
  }

  function drawScene(
    projectionMatrix: mat4,
    viewMatrix: mat4, // cameraMatrix^-1
    textureMatrix: mat4,
    lightWorldMatrix: mat4,
  ) {
    console.info('drawScene')

    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)

    const positionAttributeLocation = gl.getAttribLocation(artist.currentProgram, 'a_position')

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

    const subdivisions = controls.getInt('subdivisions', 40)
    const { positions, indices } = createPlane(subdivisions)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const primitiveType = gl.TRIANGLES
    const arrayOffset = 0

    artist.setUniform(
      'Matrix4fv',
      'u_viewMatrix',
      false,
      viewMatrix,
    )

    artist.setUniform(
      'Matrix4fv',
      'u_projectionMatrix',
      false,
      projectionMatrix,
    )

    artist.setUniform(
      'Matrix4fv',
      'u_textureMatrix',
      false,
      textureMatrix,
    )

    artist.setUniform(
      'Matrix4fv',
      'u_lightWorldMatrix',
      false,
      lightWorldMatrix,
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
