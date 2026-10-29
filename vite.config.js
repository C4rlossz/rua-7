import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { securityHeaders } from './scripts/security-headers.mjs';
import { buildInventory } from './scripts/build-inventory.mjs';

export default defineConfig({
  plugins: [react(), buildInventory()],
  server: { headers: securityHeaders(true) },
  preview: { headers: securityHeaders(false) },
  build: { chunkSizeWarningLimit: 1100 },
});
