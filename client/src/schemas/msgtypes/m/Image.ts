import z from "zod"
import { BaseImageInfo } from "../../BaseImageInfo"
import { URI } from "../../uris"
import { BaseMessageContentShape } from "../BaseMessageContentShape"

const ImageInfo = BaseImageInfo.and(z.object({
	is_animated: z.boolean().optional(),
	thumbnail_file: z.record(z.string(), z.unknown()).optional()
}))
export type ImageInfo = z.infer<typeof ImageInfo>

export const Image = z.object({
	...BaseMessageContentShape("m.image"),
	file: z.record(z.string(), z.unknown()).optional(),
	filename: z.string().optional(),
	info: ImageInfo,
	url: URI
})
export type Image = z.infer<typeof Image>