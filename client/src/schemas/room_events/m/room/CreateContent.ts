import z from "zod"
import { EventId, RoomId, UserId } from "../../../ids"
import { RoomType } from "../../../RoomType"

const PreviousRoom = z.object({
	event_id: EventId.optional(),
	room_id: RoomId
})
export type PreviousRoom = z.infer<typeof PreviousRoom>

export const RoomCreateContent = z.object({
	additional_creators: z.array(UserId).default([]),
	"m.federate": z.boolean().default(true),
	predecessor: PreviousRoom.optional(),
	room_version: z.string().default("1"),
	type: RoomType
})
export type RoomCreateContent = z.infer<typeof RoomCreateContent>