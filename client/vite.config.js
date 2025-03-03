import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	envDir: '../',
	server: {
		host: '0.0.0.0',
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
				secure: false,
				ws: true,
			},
		},
		hmr: {
			clientPort: 443,
			protocol: "wss",
			// path: "/.proxy/"
		},
		allowedHosts: ["mf-exclusively-highways-vista.trycloudflare.com"],
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: './node_modules/@discordapp/twemoji/dist/svg',
					dest: 'twemoji'
				}
			]
		})
	]
})
