import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Dev server pinned to 5174 to avoid clashing with GSB-Salak-Backend/testfrontend's
// static server, which defaults to port 5173. host:true binds it to every
// network interface (not just localhost) so a spectator's phone on the same
// network can load it from the presenter's LAN IP.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: true,
  },
});
