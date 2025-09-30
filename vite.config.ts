import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/ecm-webgl-exploration/',
  plugins: [
    tailwindcss(),
  ],
  assetsInclude: [
    '**/*.vert',
    '**/*.frag',
  ],
})
