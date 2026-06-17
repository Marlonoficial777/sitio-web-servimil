import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static site optimizado para Cloudflare Pages.
export default defineConfig({
  site: "https://servimil.pages.dev",
  vite: {
    plugins: [tailwindcss()],
  },
});
