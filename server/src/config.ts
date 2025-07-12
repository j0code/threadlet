import YSON from "@j0code/yson"
import { z } from "zod"

export const Config = z.object({
	port:  z.number(),
	oauth: z.object({
		client_id:     z.string().min(1),
		client_secret: z.string().min(1)
	}),
	client: z.object({
		public: z.string().min(1).default("/var/www/html")
	}).default({ public: "/var/www/html" })
})

export type Config = z.infer<typeof Config>

const rawConfig = await YSON.load("./config.yson")

const { data: config, error } = Config.safeParse(rawConfig)

if (error) {
	console.group("Invalid config. See errors below.")
	console.error(z.prettifyError(error))
	console.groupEnd()

	process.exit(1)
}

export default config as Config