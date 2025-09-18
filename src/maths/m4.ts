export class Mat4 {
  elements: Float32Array
  constructor(
    m11 = 1,
    m12 = 0,
    m13 = 0,
    m14 = 0,
    m21 = 0,
    m22 = 1,
    m23 = 0,
    m24 = 0,
    m31 = 0,
    m32 = 0,
    m33 = 1,
    m34 = 0,
    m41 = 0,
    m42 = 0,
    m43 = 0,
    m44 = 1,
  ) {
    this.elements = new Float32Array([
      m11,
      m12,
      m13,
      m14,
      m21,
      m22,
      m23,
      m24,
      m31,
      m32,
      m33,
      m34,
      m41,
      m42,
      m43,
      m44,
    ])
  }

  static identity() {
    return new Mat4()
  }

  static zero() {
    return new Mat4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
  }

  add(m: Mat4) {
    const e = this.elements
    const me = m.elements
    return new Mat4(
      e[0] + me[0],
      e[1] + me[1],
      e[2] + me[2],
      e[3] + me[3],
      e[4] + me[4],
      e[5] + me[5],
      e[6] + me[6],
      e[7] + me[7],
      e[8] + me[8],
      e[9] + me[9],
      e[10] + me[10],
      e[11] + me[11],
      e[12] + me[12],
      e[13] + me[13],
      e[14] + me[14],
      e[15] + me[15],
    )
  }

  subtract(m: Mat4) {
    const e = this.elements
    const me = m.elements
    return new Mat4(
      e[0] - me[0],
      e[1] - me[1],
      e[2] - me[2],
      e[3] - me[3],
      e[4] - me[4],
      e[5] - me[5],
      e[6] - me[6],
      e[7] - me[7],
      e[8] - me[8],
      e[9] - me[9],
      e[10] - me[10],
      e[11] - me[11],
      e[12] - me[12],
      e[13] - me[13],
      e[14] - me[14],
      e[15] - me[15],
    )
  }

  multiply(m: Mat4) {
    const a = this.elements
    const b = m.elements
    return new Mat4(
      a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
      a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
      a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
      a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],

      a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
      a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
      a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
      a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],

      a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
      a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
      a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
      a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],

      a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
      a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
      a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
      a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15],
    )
  }

  multiplyScalar(scalar: number) {
    const e = this.elements
    return new Mat4(
      e[0] * scalar,
      e[1] * scalar,
      e[2] * scalar,
      e[3] * scalar,
      e[4] * scalar,
      e[5] * scalar,
      e[6] * scalar,
      e[7] * scalar,
      e[8] * scalar,
      e[9] * scalar,
      e[10] * scalar,
      e[11] * scalar,
      e[12] * scalar,
      e[13] * scalar,
      e[14] * scalar,
      e[15] * scalar,
    )
  }

  transpose() {
    const e = this.elements
    return new Mat4(
      e[0],
      e[4],
      e[8],
      e[12],
      e[1],
      e[5],
      e[9],
      e[13],
      e[2],
      e[6],
      e[10],
      e[14],
      e[3],
      e[7],
      e[11],
      e[15],
    )
  }

  toArray() {
    return Array.from(this.elements)
  }

  static fromArray(arr: number[]) {
    if (arr.length !== 16) {
      throw new Error('Array must have exactly 16 elements')
    }
    return new Mat4(
      arr[0],
      arr[1],
      arr[2],
      arr[3],
      arr[4],
      arr[5],
      arr[6],
      arr[7],
      arr[8],
      arr[9],
      arr[10],
      arr[11],
      arr[12],
      arr[13],
      arr[14],
      arr[15],
    )
  }
}
