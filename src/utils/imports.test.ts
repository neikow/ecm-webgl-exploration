import { describe, expect, it } from 'vitest'
import { compileShaderWithSources, getShaderSources, parseShaderImports } from './imports.ts'

describe('parseShaderImports', () => {
  it('should parse no import statement', () => {
    const shaderCode = `#version 300 es`
    const imports = parseShaderImports(shaderCode)
    expect(imports).toEqual([])
  })
  it('should parse single import statement', () => {
    const shaderCode = `#version 300 es
// @import common.glsl
void main() {
  gl_Position = vec4(0.0);
}`
    const imports = parseShaderImports(shaderCode)
    expect(imports).toEqual([
      {
        fileName: 'common.glsl',
        startLine: 1,
        endLine: 1,
      },
    ])
  })

  it('should parse multiple import statements', () => {
    const shaderCode = `#version 300 es
// @import common.glsl
// Some comment
// @import lighting.glsl
void main() {
  gl_Position = vec4(0.0);
}`
    const imports = parseShaderImports(shaderCode)
    expect(imports).toEqual([
      {
        fileName: 'common.glsl',
        startLine: 1,
        endLine: 1,
      },
      {
        fileName: 'lighting.glsl',
        startLine: 3,
        endLine: 3,
      },
    ])
  })
})

describe('compileShaderWithSources', () => {
  it('should compile shader without imports', () => {
    const shaderCode = `#version 300 es`

    const compiled = compileShaderWithSources(shaderCode, {})
    expect(compiled).toBe(shaderCode)
  })

  it('should compile shader with imports', () => {
    const shaderCode = `#version 300 es
// @import common.glsl
void main() {
  gl_Position = vec4(0.0);
}`

    const sources = {
      'common.glsl': `vec3 getNormal() { return vec3(0.0, 1.0, 0.0); }`,
    }

    const compiled = compileShaderWithSources(
      shaderCode,
      sources,
    )
    expect(compiled).toBe(`#version 300 es
// Begin import: common.glsl
vec3 getNormal() { return vec3(0.0, 1.0, 0.0); }
// End import: common.glsl
void main() {
  gl_Position = vec4(0.0);
}`)
  })

  it('should compile shader with multiple imports', () => {
    const shaderCode = `#version 300 es
// @import common.glsl
// Some comment
// @import lighting.glsl
void main() {
  gl_Position = vec4(0.0);
}`

    const sources = {
      'common.glsl': `vec3 getNormal() { return vec3(0.0, 1.0, 0.0); }`,
      'lighting.glsl': `vec3 getLight() { return vec3(1.0, 1.0, 1.0); }`,
    }

    const compiled = compileShaderWithSources(
      shaderCode,
      sources,
    )
    expect(compiled).toBe(`#version 300 es
// Begin import: common.glsl
vec3 getNormal() { return vec3(0.0, 1.0, 0.0); }
// End import: common.glsl
// Some comment
// Begin import: lighting.glsl
vec3 getLight() { return vec3(1.0, 1.0, 1.0); }
// End import: lighting.glsl
void main() {
  gl_Position = vec4(0.0);
}`)
  })
})

describe('getShaderSources', () => {
  it('should list available shader sources', () => {
    const sources = getShaderSources()

    expect(sources).toHaveProperty('3d-noise.glsl')
    expect(sources['3d-noise.glsl']).toContain('vec4 permute(vec4 x)')
  })
})
