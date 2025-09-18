interface ImportInfo {
  fileName: string
  startLine: number
  endLine: number
}

export function parseShaderImports(shaderCode: string): ImportInfo[] {
  const imports: ImportInfo[] = []
  const lines = shaderCode.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const importMatch = line.match(/^\/\/\s*@import\s+(.+)$/)

    if (importMatch) {
      const fileName = importMatch[1].trim()
      imports.push({
        fileName,
        startLine: i,
        endLine: i,
      })
    }
  }

  return imports
}

export function compileShaderWithSources(source: string, sources: Record<string, string>): string {
  const imports = parseShaderImports(source)
  if (imports.length === 0) {
    return source
  }

  const lines = source.split('\n')
  let compiledSource = ''
  let currentLine = 0

  for (const imp of imports) {
    // Add lines before the import
    while (currentLine < imp.startLine) {
      compiledSource += `${lines[currentLine]}\n`
      currentLine++
    }

    const importedContent = sources[imp.fileName]
    if (!importedContent) {
      throw new Error(`Imported file not found: ${imp.fileName}`)
    }

    // Here you would typically load the imported file content.
    // For this example, we'll just insert a placeholder comment.
    compiledSource += `// Begin import: ${imp.fileName}\n`
    compiledSource += `${importedContent}\n`
    compiledSource += `// End import: ${imp.fileName}\n`

    // Skip the import line
    currentLine = imp.endLine + 1
  }

  // Add remaining lines after the last import
  while (currentLine < lines.length) {
    compiledSource += lines[currentLine]
    if (currentLine < lines.length - 1) {
      compiledSource += '\n'
    }
    currentLine++
  }

  return compiledSource
}

export function getShaderSources(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(import.meta.glob(`../shaders/common/*.glsl`, { query: '?raw', import: 'default', eager: true })).map(([path, value]) => {
      const file = path.split(`../shaders/common/`)[1]
      return [file, value as string] as const
    }),
  )
}

export function compileShader(source: string): string {
  const sources = getShaderSources()
  return compileShaderWithSources(source, sources)
}
