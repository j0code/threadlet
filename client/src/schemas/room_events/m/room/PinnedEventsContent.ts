import z from "zod"
import { EventId } from "../../../ids"

export const RoomPinnedEventsContent = z.object({
	pinned: z.array(EventId),
})
export type RoomPinnedEventsContent = z.infer<typeof RoomPinnedEventsContent>
