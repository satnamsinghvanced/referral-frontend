import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("jspdf") || id.includes("html2canvas") || id.includes("pdfmake")) {
              return "pdf-vendor";
            }
            if (id.includes("recharts") || id.includes("d3-")) {
              return "charts-vendor";
            }
            if (id.includes("react-icons") || id.includes("lucide-react")) {
              return "icons-vendor";
            }
          }
        },
      },
    },
  },
});
