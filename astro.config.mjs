import { defineConfig } from "astro/config";
import icon from "astro-icon";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  build: {
    inlineStylesheets: "always",
  },
  integrations: [
    icon({
      include: {
        mdi: ["weather-night", "white-balance-sunny", "linkedin"],
        "simple-icons": ["linkedin", "github", "x", "instagram", "facebook", "rss", "gmail"],
      },
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap(),
  ],
  site: "https://angel-baez.com/",
  prefetch: true,
});
