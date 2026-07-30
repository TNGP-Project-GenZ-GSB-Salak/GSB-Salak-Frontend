import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Dev server pinned to 5174 to avoid clashing with GSB-Salak-Backend/testfrontend's
// static server, which defaults to port 5173.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
  },
});
