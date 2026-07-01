import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

export default defineConfig({
  base: '/Mac_OS_Portfolio/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: process.env.DEV_ALLOWED_HOSTS 
      ? process.env.DEV_ALLOWED_HOSTS.split(',').map(h => h.trim())
      : ['localhost'],
  },
  resolve: {
    alias: {
      '#components' : resolve(dirname(fileURLToPath(import.meta.url)), 'src/components'),
      '#constants' : resolve(dirname(fileURLToPath(import.meta.url)), 'src/constants'),
      '#store' : resolve(dirname(fileURLToPath(import.meta.url)), 'src/store'),
      '#hoc' : resolve(dirname(fileURLToPath(import.meta.url)), 'src/hoc'),
      '#windows' : resolve(dirname(fileURLToPath(import.meta.url)), 'src/windows'),
    }
  }
})
