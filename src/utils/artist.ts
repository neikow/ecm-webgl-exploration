import { createFragmentShader, createProgram, createVertexShader } from './gl.ts'

export interface UniformArguments {
  '1f': [number]
  '2f': [number, number]
  '3f': [number, number, number]
  '4f': [number, number, number, number]
  '1i': [number]
  '2i': [number, number]
  '3i': [number, number, number]
  '4i': [number, number, number, number]
}

export type UniformType = keyof UniformArguments

export class Artist {
  gl: WebGL2RenderingContext
  program: WebGLProgram

  private uniformLocations: Map<string, WebGLUniformLocation>

  constructor(gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = gl
    this.program = createProgram(
      gl,
      createVertexShader(gl, vertexShaderSource),
      createFragmentShader(gl, fragmentShaderSource),
    )!
    this.uniformLocations = new Map()
  }

  private createOrGetUniformLocation(name: string): WebGLUniformLocation {
    if (this.uniformLocations.has(name)) {
      return this.uniformLocations.get(name)!
    }
    const location = this.gl.getUniformLocation(this.program, name)!
    this.uniformLocations.set(name, location)
    return location
  }

  setUniform<T extends UniformType>(type: T, name: string, ...values: UniformArguments[T]) {
    const location = this.createOrGetUniformLocation(name)
    // @ts-expect-error TS doesn't understand that args matches the method signature
    this.gl[`uniform${type}`](location, ...values)
  }
}
