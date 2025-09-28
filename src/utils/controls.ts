/** Utility class to manage HTML form controls and retrieve their values. */
export interface ControlsEventHandlers {
  change: () => void
  test: (x: number) => void
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
      test: new Set(),
    }

    this.form.addEventListener('input', () => {
      this.eventListeners.change?.forEach(listener => listener())
    })
  }

  getFloat(name: string, defaultValue: number): number {
    const element = this.form.elements.namedItem(name) as HTMLInputElement
    if (element.type === 'checkbox') {
      return element.checked ? 1 : 0
    }
    if (element.type === 'color') {
      throw new Error('Color type not supported for float value')
    }
    return element ? Number.parseFloat(element.value) : defaultValue
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
