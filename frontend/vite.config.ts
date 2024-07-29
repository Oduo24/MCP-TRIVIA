import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '192.168.88.148-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '192.168.88.148.pem')),
    },
    host: '0.0.0.0', // Expose the server to the network
    port: 5173, // Default port for Vite
  },
});
