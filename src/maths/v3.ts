export class Vec3 {
  x: number
  y: number
  z: number
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }

  add(v: Vec3) {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  subtract(v: Vec3) {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  multiply(scalar: number) {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar)
  }

  divide(scalar: number) {
    if (scalar === 0) {
      throw new Error('Division by zero')
    }
    return new Vec3(this.x / scalar, this.y / scalar, this.z / scalar)
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  normalize() {
    const len = this.length()
    if (len === 0) {
      return new Vec3(0, 0, 0)
    }
    return this.divide(len)
  }

  dot(v: Vec3) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  cross(v: Vec3) {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    )
  }

  toArray() {
    return [this.x, this.y, this.z]
  }

  static fromArray(arr: [number, number, number]) {
    return new Vec3(arr[0], arr[1], arr[2])
  }
}
