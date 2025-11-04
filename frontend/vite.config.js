import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7001,
    host: true,
    allowedHosts: [
      'carbonchain.coinsspor.com',
      '149.50.108.112',
      'localhost'
    ]
  }
});
