import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

import "./app/lib/env";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "nuxt-csurf",
  ],

  eslint: {
    config: {
      standalone: false,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@vee-validate/zod/dist/vee-validate-zod.mjs":
          fileURLToPath(new URL("./vee-validate-zod-fix.mjs", import.meta.url)),
        "@vee-validate/zod/dist/vee-validate-zod.js":
          fileURLToPath(new URL("./vee-validate-zod-fix.mjs", import.meta.url)),
      },
    },
  },

  colorMode: {
    dataValue: "theme",
  },
});
