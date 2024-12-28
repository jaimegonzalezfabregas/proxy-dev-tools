import { svelte } from '@sveltejs/vite-plugin-svelte'

export default {
  plugins: [svelte()],

  resolve: {
    alias: {
      '~bootstrap': 'node_modules/bootstrap',
    }
  },

  build: {
    outDir: '../app/frontend_dist'
  }

}
