import { defineConfig } from "astro/config";
import icon from "astro-icon";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: "always",
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    icon({
      include: {
        mdi: ["weather-night", "white-balance-sunny"],
        "simple-icons": ["linkedin", "github", "x", "instagram", "facebook", "rss", "gmail"],
      },
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          es: 'es-MX',
        },
      },
    }),
  ],
  site: "https://angel-baez.com/",
  prefetch: true,
});
