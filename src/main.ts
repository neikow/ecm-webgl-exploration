import { setupCanvas } from './canvas.ts'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class='w-full flex flex-col relative font-mono'>
    <canvas id='canvas' class='w-screen h-screen'></canvas>
    <div class='absolute top-2 right-2 w-64 bg-base-100/80 card shadow-md overflow-auto max-h-[80vh]'>
      <div class='flex items-center justify-between border-b border-base-300'>
        <h1 class='px-3 py-4 text-xl font-black'>
          Settings
        </h1>
        <div class='flex gap-2'>
          <button id='delete' class='w-10 h-10 p-2 fill-error hover:fill-primary btn cursor-pointer transition-colors'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>trash-can-outline</title><path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9M7 6H17V19H7V6M9 8V17H11V8H9M13 8V17H15V8H13Z" /></svg>
          </button>  
          <button id='randomize' class='w-10 h-10 p-2 fill-white hover:fill-primary btn cursor-pointer transition-colors'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>dice-5-outline</title><path d="M19 5V19H5V5H19M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M7.5 6C6.7 6 6 6.7 6 7.5S6.7 9 7.5 9 9 8.3 9 7.5 8.3 6 7.5 6M16.5 15C15.7 15 15 15.7 15 16.5C15 17.3 15.7 18 16.5 18C17.3 18 18 17.3 18 16.5C18 15.7 17.3 15 16.5 15M16.5 6C15.7 6 15 6.7 15 7.5S15.7 9 16.5 9C17.3 9 18 8.3 18 7.5S17.3 6 16.5 6M12 10.5C11.2 10.5 10.5 11.2 10.5 12S11.2 13.5 12 13.5 13.5 12.8 13.5 12 12.8 10.5 12 10.5M7.5 15C6.7 15 6 15.7 6 16.5C6 17.3 6.7 18 7.5 18S9 17.3 9 16.5C9 15.7 8.3 15 7.5 15Z" /></svg>
          </button>  
        </div>
      </div>
      <form id='settings' class='p-1 mt-2 flex flex-col gap-2'>
        <!-- Controls will be injected here -->
      </form>
    </div>
  </div>
`

setupCanvas(document.querySelector<HTMLCanvasElement>('#canvas')!, document.querySelector<HTMLFormElement>('#settings')!)
