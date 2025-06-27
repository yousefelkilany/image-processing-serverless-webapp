import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { DEFAULT_LOCALE, LOCALES } from "./src/i18n/utils";

import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321/",

  // todo - add site for sitemap
  build: {
    format: "directory",
  },

  integrations: [tailwind(), sitemap({
    i18n: {
      defaultLocale: DEFAULT_LOCALE,
      locales: LOCALES,
    },
  }), mdx(), react()],

  prefetch: true,
  output: "server",
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
    // build: {
    //   minify: false,
    // },
  },
});