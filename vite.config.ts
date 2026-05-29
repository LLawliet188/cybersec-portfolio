import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/cybersec-portfolio/",
  build: {
    chunkSizeWarningLimit: 950,
  },
  plugins: [react()],
});
