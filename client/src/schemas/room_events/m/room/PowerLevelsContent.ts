import z from "zod"
import { PowerLevel } from "../../../PowerLevel"
import { UserId } from "../../../ids"

const Notifications = z.object({
	room: PowerLevel.default(50)
}).catchall(PowerLevel)
export type Notifications = z.infer<typeof Notifications>

export const RoomPowerLevelsContent = z.object({
	ban: PowerLevel.default(50),
	events: z.record(z.string(), PowerLevel),
	events_default: PowerLevel.default(0),
	invite: PowerLevel.default(0),
	kick: PowerLevel.default(50),
	notifications: Notifications,
	redact: PowerLevel.default(50),
	state_default: PowerLevel.default(50),
	users: z.record(UserId, PowerLevel),
	users_default: PowerLevel.default(0)
})
export type RoomPowerLevelsContent = z.infer<typeof RoomPowerLevelsContent>