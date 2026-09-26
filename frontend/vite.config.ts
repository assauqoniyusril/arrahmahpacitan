import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 80,
    proxy: {
      "/api": { target: "http://backend:8005", changeOrigin: true },
      "/uploads": { target: "http://backend:8005", changeOrigin: true },
    },
  },
});
