import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import YSON from '@j0code/yson'

const dev_config = await YSON.load("./dev_config.yson").catch(() => ({
	vite: {
		port: undefined,
		host: undefined
	}
}))

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
	envDir: '../',
	server: {
		host: '0.0.0.0',
		port: dev_config.vite?.port,
		proxy: {
			'/api': {
				target: 'http://localhost:3001',
				changeOrigin: true,
				secure: false,
				ws: true,
			},
		},
		hmr: {
			protocol: "wss",
			// path: "/.proxy/"
		},
		allowedHosts: [dev_config.vite?.host].filter(Boolean),
		strictPort: true
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
