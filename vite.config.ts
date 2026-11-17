import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // The night-shift city pulls in Three.js. One chunk over the default warning is expected.
    chunkSizeWarningLimit: 1300,
  },
});
