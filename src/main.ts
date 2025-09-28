import { setupCanvas } from './canvas.ts'
import { createRangeSlider } from './controls/rangeSlider.ts'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class='w-full flex flex-col relative font-mono'>
    <canvas id='canvas' class='w-screen h-screen'></canvas>
    <div class='absolute top-2 right-2 w-64 bg-base-100/80 card shadow-md overflow-auto max-h-[80vh]'>
      <h1 class='px-3 py-4 text-xl font-black border-b border-base-300'>
        Settings
      </h1>
      <form id='settings' class='p-1 mt-2 flex flex-col gap-2'>
        <div class="collapse border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title font-semibold">Plane</div>
          <div class="collapse-content text-sm">
            ${createRangeSlider('subdivisions', 'Subdivisions', 40, 1, 180, 1)}
            ${createRangeSlider('planeScaleX', 'Plane Scale X', 30, 1, 100, 1)}
            ${createRangeSlider('planeScaleY', 'Plane Scale Y', 30, 1, 100, 1)}
          </div>
        </div>
        <div class="collapse border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title font-semibold">Camera</div>
          <div class="collapse-content text-sm">
            ${createRangeSlider('fov', 'Field of View (°)', 90, 0.5, 180, 0.5)}
            ${createRangeSlider('near', 'Near plane', 5, 1, 50, 1)}
            ${createRangeSlider('far', 'Far plane', 30, 1, 50, 1)}
            ${createRangeSlider('camX', 'Camera X position', 5, -10, 10, 0.1)}
            ${createRangeSlider('camY', 'Camera Y position', 5, -10, 10, 0.1)}
            ${createRangeSlider('camZ', 'Camera Z position', 10, -20, 20, 0.1)}
          </div>
        </div>
        <div class="collapse border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title font-semibold">Terrain</div>
          <div class="collapse-content text-sm">
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
        <div class="collapse border-base-300 border">
          <input type="checkbox" />
          <div class="collapse-title font-semibold">Noise</div>
          <div class="collapse-content text-sm">
            ${createRangeSlider('posOffsetX', 'Noise position offset X', 0, -1, 1, 0.01)}
            ${createRangeSlider('posOffsetY', 'Noise position offset Y', 0, -1, 1, 0.01)}
            ${createRangeSlider('noiseMulX', 'Noise multiplier X', 0.2, 0, 1, 0.01)}
            ${createRangeSlider('noiseMulY', 'Noise multiplier Y', 0.2, 0, 1, 0.01)}
            ${createRangeSlider('noiseHeight', 'Noise height', 0.8, 0, 5, 0.01)}
          </div>
        </div>
      </form>
    </div>
  </div>
`

setupCanvas(document.querySelector<HTMLCanvasElement>('#canvas')!, document.querySelector<HTMLFormElement>('#settings')!)
