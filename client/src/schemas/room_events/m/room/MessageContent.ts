import z from "zod"
import { Text } from "../../../msgtypes/m/Text"
import { Emote } from "../../../msgtypes/m/Emote"
import { Notice } from "../../../msgtypes/m/Notice"
import { Image } from "../../../msgtypes/m/Image"
import { File } from "../../../msgtypes/m/File"
import { Audio } from "../../../msgtypes/m/Audio"
import { Location } from "../../../msgtypes/m/Location"
import { Video } from "../../../msgtypes/m/Video"

const schemas = [
	Text,
	Emote,
	Notice,
	Image,
	File,
	Audio,
	Location,
	Video,
] as const

const supportedMsgtypes = schemas.map(schema => schema.shape.msgtype.value)

export const RoomMessageContent = z.discriminatedUnion("msgtype", schemas)
export type RoomMessageContent = z.infer<typeof RoomMessageContent>

export type SupportedMsgtypes = RoomMessageContent["msgtype"]

export function isSupported(msgtype: string): msgtype is SupportedMsgtypes {
	return (supportedMsgtypes as string[]).includes(msgtype)
}
