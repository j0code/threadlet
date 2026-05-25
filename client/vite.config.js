import { defineConfig } from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	envDir: "../",
	server: {
		host: "0.0.0.0",
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				changeOrigin: true,
				secure: false,
				ws: true,
			},
		},
		hmr: {
			protocol: "ws",
		},
		allowedHosts: [],
		strictPort: true,
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: "./node_modules/@discordapp/twemoji/dist/svg",
					dest: "twemoji",
				},
			],
		}),
	],
})
