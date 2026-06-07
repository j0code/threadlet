import z from "zod"
import { EventId } from "../../../ids"

export const RoomRedactionContent = z.object({
	reason: z.string().default(""),
	redacts: EventId
})
export type RoomRedactionContent = z.infer<typeof RoomRedactionContent>