export function createRangeSlider(name: string, label: string, initialValue = 0.5, min = 0, max = 1, step = 0.01): string {
  return `
    <div class='fieldset'>
      <label for='${name}' class='fieldset-label'>
        ${label}
      </label>
      <input id='${name}' type='range' name='${name}' value='${initialValue}' min='${min}' max='${max}' step='${step}' />
    </div>`
}
