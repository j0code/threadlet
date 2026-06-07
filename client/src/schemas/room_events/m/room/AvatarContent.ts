import z from "zod"
import { BaseImageInfo } from "../../../BaseImageInfo"

export const AvatarInfo = BaseImageInfo
export type AvatarInfo = z.infer<typeof AvatarInfo>

export const RoomAvatarContent = z.object({
	name: z.string()
})
export type RoomAvatarContent = z.infer<typeof RoomAvatarContent>