import { setupCanvas } from './canvas.ts'
import { createRangeSlider } from './controls/rangeSlider.ts'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class='w-full flex flex-col relative'>
    <canvas id='canvas' class='w-screen h-screen'></canvas>
    <div class='absolute top-2 right-2 w-64 p-2 bg-base-100 shadow-md'>
      <h1 class='card-title'>
        Settings
      </h1>
      <form id='settings' class='mt-2 flex flex-col gap-2'>
        <div class="collapse bg-base-100 border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title font-semibold">Camera</div>
          <div class="collapse-content text-sm">
            ${createRangeSlider('fov', 'Field of View (°)', 80, 0.5, 180, 0.5)}
            ${createRangeSlider('near', 'Near plane', 5, 1, 500, 1)}
            ${createRangeSlider('far', 'Far plane', 100, 1, 500, 1)}
            ${createRangeSlider('camX', 'Camera X position', 5, -10, 10, 0.1)}
            ${createRangeSlider('camY', 'Camera Y position', 5, -10, 10, 0.1)}
            ${createRangeSlider('camZ', 'Camera Z position', 5, -10, 10, 0.1)}
          </div>
        </div>
        <div class="collapse bg-base-100 border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title font-semibold">Noise</div>
          <div class="collapse-content text-sm">
            ${createRangeSlider('posOffsetX', 'Noise position offset X')}
            ${createRangeSlider('posOffsetY', 'Noise position offset Y')}
            ${createRangeSlider('noiseMulX', 'Noise multiplier Y')}
            ${createRangeSlider('noiseMulY', 'Noise multiplier Y')}
            <div class='flex gap-2'>
              <div class='fieldset'>
                <label for='color1' class='fieldset-label'>
                  Color 1
                </label>
                <input id='color1' type='color' name='color1' />
              </div>
              <div class='fieldset'>
                <label for='color2' class='fieldset-label'>
                  Color 2
                </label>
                <input id='color2' type='color' name='color2' value='#ffffff' />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
`

setupCanvas(document.querySelector<HTMLCanvasElement>('#canvas')!, document.querySelector<HTMLFormElement>('#settings')!)
