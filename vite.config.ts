import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [react(), runtimeErrorOverlay()],
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
});
