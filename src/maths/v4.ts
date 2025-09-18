export class Vec4 {
  x: number
  y: number
  z: number
  w: number
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  add(v: Vec4) {
    return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w)
  }

  subtract(v: Vec4) {
    return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w)
  }

  multiply(scalar: number) {
    return new Vec4(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar)
  }

  divide(scalar: number) {
    if (scalar === 0) {
      throw new Error('Division by zero')
    }
    return new Vec4(this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar)
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
  }

  normalize() {
    const len = this.length()
    if (len === 0) {
      return new Vec4(0, 0, 0, 0)
    }
    return this.divide(len)
  }

  dot(v: Vec4) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w
  }

  toArray() {
    return [this.x, this.y, this.z, this.w]
  }

  static fromArray(arr: [number, number, number, number]) {
    return new Vec4(arr[0], arr[1], arr[2], arr[3])
  }
}
