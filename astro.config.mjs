import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import icon from "astro-icon";
import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    icon({
      include: {
        mdi: ["linkedin", "github", "twitter", "email", "instagram", "rss"],
      },
    }),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  site: "https://angel-baez.com/",
  prefetch: true,
});
