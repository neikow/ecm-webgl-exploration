import { setupCanvas } from './canvas.ts'
import { createColorPicker, createRangeSlider } from './utils/controls.ts'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class='w-full flex flex-col relative font-mono'>
    <canvas id='canvas' class='w-screen h-screen'></canvas>
    <div class='absolute top-2 right-2 w-64 bg-base-100/80 card shadow-md overflow-auto max-h-[80vh]'>
      <div class='flex items-center justify-between'>
        <h1 class='px-3 py-4 text-xl font-black border-b border-base-300'>
          Settings
        </h1>
        <button id='randomize' class='w-10 h-10 p-2 m-2 fill-white hover:fill-primary btn cursor-pointer transition-colors'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>dice-5-outline</title><path d="M19 5V19H5V5H19M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M7.5 6C6.7 6 6 6.7 6 7.5S6.7 9 7.5 9 9 8.3 9 7.5 8.3 6 7.5 6M16.5 15C15.7 15 15 15.7 15 16.5C15 17.3 15.7 18 16.5 18C17.3 18 18 17.3 18 16.5C18 15.7 17.3 15 16.5 15M16.5 6C15.7 6 15 6.7 15 7.5S15.7 9 16.5 9C17.3 9 18 8.3 18 7.5S17.3 6 16.5 6M12 10.5C11.2 10.5 10.5 11.2 10.5 12S11.2 13.5 12 13.5 13.5 12.8 13.5 12 12.8 10.5 12 10.5M7.5 15C6.7 15 6 15.7 6 16.5C6 17.3 6.7 18 7.5 18S9 17.3 9 16.5C9 15.7 8.3 15 7.5 15Z" /></svg>
        </button>
      </div>
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
              ${createColorPicker('color1', 'Color 1', '#000000')}
              ${createColorPicker('color2', 'Color 2', '#ffffff')}
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
