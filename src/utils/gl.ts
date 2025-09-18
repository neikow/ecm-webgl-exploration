function createShader(
  gl: WebGL2RenderingContext,
  type: WebGL2RenderingContext['VERTEX_SHADER'] | WebGL2RenderingContext['FRAGMENT_SHADER'],
  source: string,
) {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('Unable to create shader')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean

  if (success) {
    return shader
  }

  console.error(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
  throw new Error('Shader compilation failed')
}

export function createFragmentShader(
  gl: WebGL2RenderingContext,
  source: string,
) {
  return createShader(gl, gl.FRAGMENT_SHADER, source)
}

export function createVertexShader(
  gl: WebGL2RenderingContext,
  source: string,
) {
  return createShader(gl, gl.VERTEX_SHADER, source)
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram()
  if (!program) {
    throw new Error('Unable to create program')
  }
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  const success = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean

  if (success) {
    return program
  }

  console.error(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}
