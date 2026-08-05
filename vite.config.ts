import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Dev server pinned to port 5174 (a fixed convention, distinct from the
// backend's :8080 and GSB-Salak-Backend/adminfrontend's :5175). host:true
// binds it to every network interface (not just localhost) so a
// spectator's phone on the same network can load it from the presenter's
// LAN IP.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    host: true,
  },
});
