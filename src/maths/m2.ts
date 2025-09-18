export class Mat2 {
  elements: [number, number, number, number]
  constructor(
    m11 = 1,
    m12 = 0,
    m21 = 0,
    m22 = 1,
  ) {
    this.elements = [m11, m12, m21, m22]
  }

  static identity() {
    return new Mat2()
  }

  static zero() {
    return new Mat2(0, 0, 0, 0)
  }

  add(m: Mat2) {
    const e = this.elements
    const me = m.elements
    return new Mat2(
      e[0] + me[0],
      e[1] + me[1],
      e[2] + me[2],
      e[3] + me[3],
    )
  }

  subtract(m: Mat2) {
    const e = this.elements
    const me = m.elements
    return new Mat2(
      e[0] - me[0],
      e[1] - me[1],
      e[2] - me[2],
      e[3] - me[3],
    )
  }

  multiply(m: Mat2) {
    const a = this.elements
    const b = m.elements
    return new Mat2(
      a[0] * b[0] + a[1] * b[2],
      a[0] * b[1] + a[1] * b[3],
      a[2] * b[0] + a[3] * b[2],
      a[2] * b[1] + a[3] * b[3],
    )
  }

  multiplyScalar(scalar: number) {
    const e = this.elements
    return new Mat2(
      e[0] * scalar,
      e[1] * scalar,
      e[2] * scalar,
      e[3] * scalar,
    )
  }

  determinant() {
    const e = this.elements
    return e[0] * e[3] - e[1] * e[2]
  }

  transpose() {
    const e = this.elements
    return new Mat2(
      e[0],
      e[2],
      e[1],
      e[3],
    )
  }

  inverse() {
    const det = this.determinant()
    if (det === 0) {
      throw new Error('Matrix is not invertible')
    }
    const e = this.elements
    const invDet = 1 / det
    return new Mat2(
      e[3] * invDet,
      -e[1] * invDet,
      -e[2] * invDet,
      e[0] * invDet,
    )
  }

  toArray() {
    return [...this.elements]
  }

  static fromArray(arr: [number, number, number, number]) {
    return new Mat2(arr[0], arr[1], arr[2], arr[3])
  }
}
