// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";
import starlight from "@astrojs/starlight";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	output: "static",
	site: "https://outboundendurance.com",
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	integrations: [
		starlight({
			title: "Outbound Endurance",
			routeMiddleware: ["./src/routeData.ts"],
			logo: {
				dark: "./src/assets/home-button-for-dark-theme.svg",
				light: "./src/assets/home-button-for-light-theme.svg",
				replacesTitle: true,
			},
			components: {
				Footer: "./src/components/Footer.astro",
				SiteTitle: "./src/components/SiteTitle.astro",
				Search: "./src/components/Search.astro",
			},
		}),
		sitemap(),
	],
});
