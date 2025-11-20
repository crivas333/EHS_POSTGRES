import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist", // adjust for backend integration
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ main frontend source root
      "@modules": path.resolve(__dirname, "src/modules"), // optional shortcut
      "@graphql": path.resolve(__dirname, "src/graphqlClient"), // optional shortcut
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/graphql": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      host: "192.168.18.10",
      port: 5173,
      overlay: false,
    },
  },
  logLevel: "error",
});
