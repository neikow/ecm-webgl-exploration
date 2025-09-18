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
        <input/>
      </form>
    </div>
  </div>
`

setupCanvas(document.querySelector<HTMLCanvasElement>('#canvas')!, document.querySelector<HTMLFormElement>('#settings')!)
