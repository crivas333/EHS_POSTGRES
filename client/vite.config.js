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
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Better chunk splitting for features
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          utils: ['date-fns', 'lodash'],
        }
      }
    }
  },
  resolve: {
    alias: {
      // Core aliases
      "@": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@common": path.resolve(__dirname, "src/common"),
      "@features": path.resolve(__dirname, "src/features"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@services": path.resolve(__dirname, "src/services"),
      "@types": path.resolve(__dirname, "src/types"),
      
      // Feature-specific aliases (optional but helpful)
      "@auth": path.resolve(__dirname, "src/features/auth"),
      "@patients": path.resolve(__dirname, "src/features/patient"),
      "@appointments": path.resolve(__dirname, "src/features/appointments"),
      "@encounters": path.resolve(__dirname, "src/features/encounters"),
      "@scheduler": path.resolve(__dirname, "src/features/scheduler"),
      "@system": path.resolve(__dirname, "src/features/system-config"),
      
      // Legacy aliases (keep for backward compatibility during migration)
      "@modules": path.resolve(__dirname, "src/features"), // points to features now
      "@graphql": path.resolve(__dirname, "src/services/graphql"), // updated path
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
