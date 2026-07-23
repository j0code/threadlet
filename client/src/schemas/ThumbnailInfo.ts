import z from "zod"

export const ThumbnailInfo = z.object({
	h: z.number().int(),
	mimetype: z.string(),
	size: z.number().int(),
	w: z.number().int(),
})
export type ThumbnailInfo = z.infer<typeof ThumbnailInfo>
