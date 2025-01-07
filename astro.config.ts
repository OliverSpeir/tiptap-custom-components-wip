import { defineConfig } from "astro/config";
export default defineConfig({
	site: "http://www.example.com",
	vite: {
		build: {
			sourcemap: true,
		},
	},
});
