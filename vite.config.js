import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa";
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      devOptions: {
        enabled: true // For making sure that the PWA is testable from the Local dev environment
      },
      registerType: 'autoUpdate',
      manifest:{
        "theme_color": "#000000",
        "background_color": "#000000",
        "display": "standalone",
        "scope": "/",
        "start_url": "/",
        "name": "chat",
        "short_name": "chatapp",
        "description": "react chat app",
        "icons": [
           
            {
                "src": "/icon-512x512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    },
    }),
  ],
});