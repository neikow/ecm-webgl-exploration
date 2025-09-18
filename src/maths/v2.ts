export class Vector2 {
  x: number
  y: number
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  add(v: Vector2) {
    return new Vector2(this.x + v.x, this.y + v.y)
  }

  subtract(v: Vector2) {
    return new Vector2(this.x - v.x, this.y - v.y)
  }

  multiply(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  divide(scalar: number) {
    if (scalar === 0) {
      throw new Error('Division by zero')
    }
    return new Vector2(this.x / scalar, this.y / scalar)
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    const len = this.length()
    if (len === 0) {
      return new Vector2(0, 0)
    }
    return this.divide(len)
  }

  dot(v: Vector2) {
    return this.x * v.x + this.y * v.y
  }

  toArray() {
    return [this.x, this.y]
  }

  static fromArray(arr: [number, number]) {
    return new Vector2(arr[0], arr[1])
  }
}
