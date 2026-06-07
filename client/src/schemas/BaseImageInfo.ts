import z from "zod"
import { BaseFileInfo } from "./BaseFileInfo"

export const BaseImageInfo = BaseFileInfo.and(z.object({
	h: z.number().int(),
	w: z.number().int()
}))
export type BaseImageInfo = z.infer<typeof BaseImageInfo>