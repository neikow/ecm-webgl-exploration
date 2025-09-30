import type { mat2, mat3, mat4 } from 'gl-matrix'
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
  'Matrix2fv': [boolean, mat2]
  'Matrix3fv': [boolean, mat3]
  'Matrix4fv': [boolean, mat4]
  '1fv': [Float32Array]
}

export type UniformType = keyof UniformArguments

export interface ShaderDefinition {
  vertex: string
  fragment: string
}

export class Artist<ProgramNames extends string> {
  gl: WebGL2RenderingContext
  programs: Record<ProgramNames, WebGLProgram>

  private readonly uniformLocations: Record<ProgramNames, Map<string, WebGLUniformLocation>>

  currentProgramName: ProgramNames | null = null

  constructor(gl: WebGL2RenderingContext, programDefinitions: Record<ProgramNames, ShaderDefinition>) {
    this.gl = gl
    this.programs = Object.fromEntries(
      Object.entries<ShaderDefinition>(programDefinitions).map(([name, def]) => {
        return [name, createProgram(
          gl,
          createVertexShader(gl, def.vertex),
          createFragmentShader(gl, def.fragment),
        )!]
      }),
    ) as Record<ProgramNames, WebGLProgram>
    this.uniformLocations = Object.fromEntries(
      Object.keys(programDefinitions).map(name => [name, new Map<string, WebGLUniformLocation>()]),
    ) as Record<ProgramNames, Map<string, WebGLUniformLocation>>
  }

  useProgram(name: ProgramNames) {
    if (this.currentProgramName !== name) {
      this.gl.useProgram(this.programs[name])
      this.currentProgramName = name
    }
  }

  get currentProgram(): WebGLProgram {
    if (!this.currentProgramName) {
      throw new Error('No program is currently in use. Call useProgram(name) first.')
    }
    return this.programs[this.currentProgramName]
  }

  private createOrGetUniformLocation(name: string): WebGLUniformLocation {
    if (!this.currentProgramName) {
      throw new Error('No program is currently in use. Call useProgram(name) first.')
    }

    const programLocations = this.uniformLocations[this.currentProgramName]

    if (programLocations.has(name)) {
      return programLocations.get(name)!
    }
    const location = this.gl.getUniformLocation(this.currentProgram, name)!
    programLocations.set(name, location)
    return location
  }

  setUniform<T extends UniformType>(type: T, name: string, ...values: UniformArguments[T]) {
    const location = this.createOrGetUniformLocation(name)
    // @ts-expect-error TS doesn't understand that args matches the method signature
    this.gl[`uniform${type}`](location, ...values)
  }
}
