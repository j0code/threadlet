import z from "zod"
import { ThumbnailInfo } from "./ThumbnailInfo"
import { URI } from "./uris"

export const BaseFileInfo = z.object({
	mimetype: z.string(),
	size: z.number().int(),
	thumbnail_info: ThumbnailInfo.optional(),
	thumbnail_url: URI.optional()
})
export type BaseFileInfo = z.infer<typeof BaseFileInfo>