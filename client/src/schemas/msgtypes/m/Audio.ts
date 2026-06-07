import z from "zod"
import { URI } from "../../uris"
import { BaseMessageContentShape } from "../BaseMessageContentShape"

const AudioInfo = z.object({
	duration: z.number().int(),
	mimetype: z.string(),
	size: z.number().int()
})
export type AudioInfo = z.infer<typeof AudioInfo>

export const Audio = z.object({
	...BaseMessageContentShape("m.audio"),
	file: z.record(z.string(), z.unknown()).optional(),
	filename: z.string().optional(),
	info: AudioInfo,
	url: URI
})
export type Audio = z.infer<typeof Audio>