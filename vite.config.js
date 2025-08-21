// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//   ], server: {
//     proxy: {
//       '/api': 'http://localhost:5000', // or whatever backend port you're using
//     },
//   },
// })
// 
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react' // ✅ This is the official plugin
// import tailwindcss from 'tailwindcss' // ✅ Correct way to import tailwind plugin

export default defineConfig({
  plugins: [
    react(),         // ✅ Must include React plugin
    tailwindcss(),   // ✅ Tailwind plugin
  ],
  server: {
    port: 5173, // ✅ optional, defaults to 5173
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
