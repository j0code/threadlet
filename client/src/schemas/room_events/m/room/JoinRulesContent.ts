import z from "zod"
import { RoomId } from "../../../ids"

const AllowCondition = z.discriminatedUnion("type", [
	z.object({
		room_id: RoomId,
		type: z.literal("m.room.membership"),
	}),
])
export type AllowCondition = z.infer<typeof AllowCondition>

export const RoomJoinRulesContent = z.object({
	allow: AllowCondition,
	join_rule: z.union([
		z.literal("public"),
		z.literal("knock"),
		z.literal("invite"),
		z.literal("private"),
		z.literal("restricted"),
		z.literal("knock_restricted"),
	]),
})
export type RoomJoinRulesContent = z.infer<typeof RoomJoinRulesContent>
