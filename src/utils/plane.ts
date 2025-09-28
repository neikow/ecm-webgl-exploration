export interface Plane { positions: number[], indices: number[] }

export function createPlane(subdivisions: number): Plane {
  const positions: number[] = []
  const indices: number[] = []

  for (let y = 0; y <= subdivisions; y++) {
    for (let x = 0; x <= subdivisions; x++) {
      const u = x / subdivisions
      const v = y / subdivisions
      positions.push(u * 2 - 1, v * 2 - 1, 0)
    }
  }

  for (let y = 0; y < subdivisions; y++) {
    for (let x = 0; x < subdivisions; x++) {
      const i = y * (subdivisions + 1) + x
      indices.push(i, i + 1, i + subdivisions + 1)
      indices.push(i + 1, i + subdivisions + 2, i + subdivisions + 1)
    }
  }

  return { positions, indices }
}

export function getCachedCreatePlane() {
  const cache = new Map<number, Plane>()

  return (subdivisions: number) => {
    if (cache.has(subdivisions)) {
      return cache.get(subdivisions)!
    }
    const plane = createPlane(subdivisions)
    cache.set(subdivisions, plane)
    return plane
  }
}
