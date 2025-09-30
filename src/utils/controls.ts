/** Utility class to manage HTML form controls and retrieve their values. */
export interface ControlsEventHandlers {
  change: () => void
}

export interface ControlFieldBase {
  type: string
  name: string
  label: string
  isRandomized: boolean
}

export interface ControlFieldRange extends ControlFieldBase {
  type: 'range'
  initialValue: number
  min: number
  max: number
  step: number
}

export interface ControlFieldColor extends ControlFieldBase {
  type: 'color'
  initialValue: string
}

export type ControlField = ControlFieldRange | ControlFieldColor

export interface ControlFieldGroup {
  type: 'group'
  flex: 'row' | 'column'
  fields: ControlField[]
}

export interface ControlFieldSection {
  label: string
  fields: (ControlField | ControlFieldGroup)[]
}

type ExtractFieldNames<T extends readonly ControlFieldSection[]>
  = T[number]['fields'] extends (infer F)[]
    ? F extends ControlFieldGroup
      ? F['fields'][number]['name']
      : F extends ControlField
        ? F['name']
        : never
    : never

type FieldTypeMap<T extends readonly ControlFieldSection[]> = {
  [K in ExtractFieldNames<T>]:
  K extends infer N
    ? N extends string
      ? T[number]['fields'] extends (infer F)[]
        ? F extends ControlFieldGroup
          ? F['fields'][number] extends { name: N, type: infer FT }
            ? FT extends 'color' ? [number, number, number]
              : FT extends 'range' ? number
                : never
            : never
          : F extends { name: N, type: infer FT }
            ? FT extends 'color' ? [number, number, number]
              : FT extends 'range' ? number
                : never
            : never
        : never
      : never
    : never
}

export class Controls<T extends readonly ControlFieldSection[]> {
  form: HTMLFormElement

  sections: Readonly<ControlFieldSection[]>

  eventListeners: {
    [E in keyof ControlsEventHandlers]: Set<ControlsEventHandlers[E]>
  }

  constructor(form: HTMLFormElement, sections: Readonly<T>) {
    this.form = form
    this.sections = sections
    this.eventListeners = {
      change: new Set(),
    }

    this.form.addEventListener('input', () => {
      this.eventListeners.change?.forEach(listener => listener())
    })

    this.addToDOM()

    for (const element of this.form.elements) {
      const inputElement = element as HTMLInputElement
      if (!inputElement.name)
        continue

      element.addEventListener('input', (ev) => {
        const input = ev.target as HTMLInputElement
        localStorage.setItem(`control-${input.name}`, input.value)
      })
    }
  }

  private addToDOM() {
    this.form.innerHTML = ''

    this.sections.forEach((section) => {
      const sectionEl = document.createElement('div')
      sectionEl.className = 'collapse border-base-300 border'
      sectionEl.innerHTML = `
        <input type="checkbox" />
        <div class="collapse-title font-semibold">${section.label}</div>
        <div class="collapse-content text-sm">
          ${(section.fields.map((field) => {
            if (field.type === 'group') {
              return `
                <div class='flex ${field.flex === 'row' ? 'flex-row' : 'flex-col'} gap-2'>
                  ${field.fields.map(f => this.renderField(f)).join('')}
                </div>
              `
            }
            else {
              return this.renderField(field)
            }
          }).join(''))}
        </div>
      `

      this.form.appendChild(sectionEl)
    })
  }

  private renderField(field: ControlField) {
    const initialValue = localStorage.getItem(`control-${field.name}`) ?? field.initialValue.toString()

    if (field.type === 'range') {
      return createRangeSlider(field.name, field.label, initialValue, field.min, field.max, field.step, field.isRandomized)
    }
    else if (field.type === 'color') {
      return createColorPicker(field.name, field.label, initialValue, field.isRandomized)
    }
    else {
      throw new Error('Unsupported field type', { cause: 'unknown field type' })
    }
  }

  reset() {
    for (const element of this.form.elements) {
      const inputElement = element as HTMLInputElement
      if (!inputElement.name)
        continue

      const field = this.sections.flatMap(s => s.fields).flatMap(f => f.type === 'group' ? f.fields : f).find(f => f.name === inputElement.name) as ControlField | undefined
      if (!field)
        continue

      inputElement.value = field.initialValue.toString()
      inputElement.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  randomize() {
    const elements = this.form.elements
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i) as HTMLInputElement

      const isRandomized = element.dataset.isRandomized === 'true'

      if (!isRandomized)
        continue

      if (!element.name)
        continue

      if (element.type === 'range') {
        const min = Number.parseFloat(element.min) || 0
        const max = Number.parseFloat(element.max) || 1
        const step = Number.parseFloat(element.step) || 0.01
        const steps = Math.floor((max - min) / step)
        const randomStep = Math.floor(Math.random() * (steps + 1))
        const newValue = min + randomStep * step

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

      element.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  private getNumber<K extends keyof FieldTypeMap<T>>(name: K, defaultValue: number, parser: (value: string) => number): number {
    const element = this.form.elements.namedItem(name) as HTMLInputElement
    if (element.type === 'checkbox') {
      return element.checked ? 1 : 0
    }
    if (element.type === 'color') {
      throw new Error('Color type not supported for float value')
    }
    return element ? parser(element.value) : defaultValue
  }

  getFloat<K extends keyof FieldTypeMap<T>>(name: K, defaultValue: number): number {
    return this.getNumber(name, defaultValue, Number.parseFloat)
  }

  getInt<K extends keyof FieldTypeMap<T>>(name: K, defaultValue: number): number {
    return this.getNumber(name, defaultValue, Number.parseInt)
  }

  getColor<K extends keyof FieldTypeMap<T>>(name: K): [number, number, number] {
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

export function createRangeSlider(name: string, label: string, initialValue = '0.5', min = 0, max = 1, step = 0.01, isRandomized: boolean = false): string {
  return `
    <div class='fieldset'>
      <label for='${name}' class='fieldset-label'>
        ${label}
      </label>
      <input id='${name}' type='range' name='${name}' value='${initialValue}' min='${min}' max='${max}' step='${step}' data-is-randomized='${isRandomized}' />
    </div>`
}

export function createColorPicker(name: string, label: string, initialValue = '#000000', isRandomized: boolean = false): string {
  return `
    <div class='fieldset'>
      <label for='${name}' class='fieldset-label'>
        ${label}
      </label>
      <input id='${name}' value='${initialValue}' type='color' name='${name}' data-is-randomized='${isRandomized}' />
    </div>
    `
}
