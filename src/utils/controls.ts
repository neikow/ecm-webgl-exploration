/** Utility class to manage HTML form controls and retrieve their values. */
export interface ControlsEventHandlers {
  change: () => void
}

export class Controls {
  form: HTMLFormElement

  eventListeners: {
    [E in keyof ControlsEventHandlers]: Set<ControlsEventHandlers[E]>
  }

  constructor(form: HTMLFormElement) {
    this.form = form
    this.eventListeners = {
      change: new Set(),
    }

    this.form.addEventListener('input', () => {
      this.eventListeners.change?.forEach(listener => listener())
    })
  }

  randomize() {
    const elements = this.form.elements
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i) as HTMLInputElement

      if (!element.name)
        continue

      if (element.type === 'range') {
        const min = Number.parseFloat(element.min) || 0
        const max = Number.parseFloat(element.max) || 1
        const step = Number.parseFloat(element.step) || 0.01
        const steps = Math.floor((max - min) / step)
        const randomStep = Math.floor(Math.random() * (steps + 1))

        const newValue = Number.parseFloat(element.value) + (min + randomStep * step) * 0.1 * (Math.random() < 0.5 ? -1 : 1)

        element.value = newValue.toString()
      }
      else if (element.type === 'color') {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        element.value = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      }
      else {
        throw new Error('Unsupported input type for randomization', { cause: element.type })
      }
    }
  }

  private getNumber(name: string, defaultValue: number, parser: (value: string) => number): number {
    const element = this.form.elements.namedItem(name) as HTMLInputElement
    if (element.type === 'checkbox') {
      return element.checked ? 1 : 0
    }
    if (element.type === 'color') {
      throw new Error('Color type not supported for float value')
    }
    return element ? parser(element.value) : defaultValue
  }

  getFloat(name: string, defaultValue: number): number {
    return this.getNumber(name, defaultValue, Number.parseFloat)
  }

  getInt(name: string, defaultValue: number): number {
    return this.getNumber(name, defaultValue, Number.parseInt)
  }

  getColor(name: string): [number, number, number] {
    const element = this.form.elements.namedItem(name) as HTMLInputElement
    if (!element) {
      throw new Error('Element not found')
    }
    if (element.type === 'color') {
      const hex = element.value
      const r = Number.parseInt(hex.slice(1, 3), 16) / 255
      const g = Number.parseInt(hex.slice(3, 5), 16) / 255
      const b = Number.parseInt(hex.slice(5, 7), 16) / 255
      return [r, g, b]
    }
    throw new Error('Not a color input')
  }

  addEventListener<E extends keyof ControlsEventHandlers>(event: E, listener: ControlsEventHandlers[E]) {
    const listeners = this.eventListeners[event]
    listeners.add(listener)
  }

  removeEventListener<E extends keyof ControlsEventHandlers>(event: E, listener: ControlsEventHandlers[E]) {
    const listeners = this.eventListeners[event]
    listeners.delete(listener)
  }
}

export function createRangeSlider(name: string, label: string, initialValue = 0.5, min = 0, max = 1, step = 0.01): string {
  return `
    <div class='fieldset'>
      <label for='${name}' class='fieldset-label'>
        ${label}
      </label>
      <input id='${name}' type='range' name='${name}' value='${initialValue}' min='${min}' max='${max}' step='${step}' />
    </div>`
}

export function createColorPicker(name: string, label: string, initialValue = '#000000'): string {
  return `
    <div class='fieldset'>
      <label for='${name}' class='fieldset-label'>
        ${label}
      </label>
      <input id='${name}' value='${initialValue}' type='color' name='${name}' />
    </div>
    `
}
