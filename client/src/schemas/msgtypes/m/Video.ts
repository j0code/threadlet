import z from "zod"
import { BaseFileInfo } from "../../BaseFileInfo"
import { URI } from "../../uris"
import { BaseMessageContentShape } from "../BaseMessageContentShape"

const VideoInfo = BaseFileInfo.and(z.object({
	duration: z.number().int(),
	thumbnail_file: z.record(z.string(), z.unknown()).optional()
}))
export type VideoInfo = z.infer<typeof VideoInfo>

export const Video = z.object({
	...BaseMessageContentShape("m.video"),
	file: z.record(z.string(), z.unknown()).optional(),
	filename: z.string().optional(),
	info: VideoInfo,
	url: URI
})
export type Video = z.infer<typeof Video>