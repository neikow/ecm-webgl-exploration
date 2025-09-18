import { compileShader } from './imports.ts'

/**
 * Imports a vertex shader stored in /src/shaders/
 * @param name The name of the shader to import, without the extension
 */
export async function getVertexShader(name: string): Promise<string> {
  const content = await import((`../shaders/${name}.vert?raw`))
  return compileShader(content.default)
}

/**
 * Imports a fragment shader stored in /src/shaders/
 * @param name The name of the shader to import, without the extension
 */
export async function getFragmentShader(name: string): Promise<string> {
  const content = await import((`../shaders/${name}.frag?raw`))
  return compileShader(content.default)
}
