import { setupCanvas } from './canvas.ts'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class='w-full flex flex-col relative'>
    <canvas id='canvas' class='w-screen h-screen'></canvas>
    <div class='absolute top-2 right-2 w-64 p-2 bg-base-100 shadow-md'>
      <h1 class='card-title'>
        Settings
      </h1>
      <form id='settings'>
        <div class='fieldset'>
          <label for='posOffsetX' class='fieldset-label'>
            Pos Offset X
          </label>
          <input id='posOffsetX' type='range' class='range' name='posOffsetX' min='0' max='1' step='0.01' />
        </div>
        <div class='fieldset'>
          <label for='posOffsetY' class='fieldset-label'>
            Pos Offset Y
          </label>
          <input id='posOffsetY' type='range' class='range' name='posOffsetY' min='0' max='1' step='0.01' />
        </div>
        <div class='fieldset'>
          <label for='noiseMulX' class='fieldset-label'>
            Noise Mul X
          </label>
          <input id='noiseMulX' type='range' class='range' name='noiseMulX' min='0' max='1' step='0.01' />
        </div>
        <div class='fieldset'>
          <label for='noiseMulY' class='fieldset-label'>
            Noise Mul Y
          </label>
          <input id='noiseMulY' type='range' class='range' name='noiseMulY' min='0' max='1' step='0.01' />
        </div>
        <div class='flex gap-2'>
          <div class='fieldset'>
            <label for='color1' class='fieldset-label'>
              Color 1
            </label>
            <input id='color1' type='color'  name='color1' />
          </div>
          <div class='fieldset'>
            <label for='color2' class='fieldset-label'>
              Color 2
            </label>
            <input id='color2' type='color' name='color2' />
          </div>
        </div>
      </form>
    </div>
  </div>
`

setupCanvas(document.querySelector<HTMLCanvasElement>('#canvas')!, document.querySelector<HTMLFormElement>('#settings')!)
