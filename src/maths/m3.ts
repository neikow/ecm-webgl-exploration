export class Mat3 {
  elements: [number, number, number, number, number, number, number, number, number]
  constructor(
    m11 = 1,
    m12 = 0,
    m13 = 0,
    m21 = 0,
    m22 = 1,
    m23 = 0,
    m31 = 0,
    m32 = 0,
    m33 = 1,
  ) {
    this.elements = [
      m11,
      m12,
      m13,
      m21,
      m22,
      m23,
      m31,
      m32,
      m33,
    ]
  }

  static identity() {
    return new Mat3()
  }

  static zero() {
    return new Mat3(0, 0, 0, 0, 0, 0, 0, 0, 0)
  }

  add(m: Mat3) {
    const e = this.elements
    const me = m.elements
    return new Mat3(
      e[0] + me[0],
      e[1] + me[1],
      e[2] + me[2],
      e[3] + me[3],
      e[4] + me[4],
      e[5] + me[5],
      e[6] + me[6],
      e[7] + me[7],
      e[8] + me[8],
    )
  }

  subtract(m: Mat3) {
    const e = this.elements
    const me = m.elements
    return new Mat3(
      e[0] - me[0],
      e[1] - me[1],
      e[2] - me[2],
      e[3] - me[3],
      e[4] - me[4],
      e[5] - me[5],
      e[6] - me[6],
      e[7] - me[7],
      e[8] - me[8],
    )
  }

  multiply(m: Mat3) {
    const a = this.elements
    const b = m.elements
    return new Mat3(
      a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
      a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
      a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

      a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
      a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
      a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

      a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
      a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
      a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
    )
  }

  multiplyScalar(scalar: number) {
    const e = this.elements
    return new Mat3(
      e[0] * scalar,
      e[1] * scalar,
      e[2] * scalar,
      e[3] * scalar,
      e[4] * scalar,
      e[5] * scalar,
      e[6] * scalar,
      e[7] * scalar,
      e[8] * scalar,
    )
  }

  toArray() {
    return this.elements.slice() as [number, number, number, number, number, number, number, number, number]
  }

  static fromArray(arr: [number, number, number, number, number, number, number, number, number]) {
    return new Mat3(
      arr[0],
      arr[1],
      arr[2],
      arr[3],
      arr[4],
      arr[5],
      arr[6],
      arr[7],
      arr[8],
    )
  }
}
