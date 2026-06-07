import z from "zod"

export const RoomNameContent = z.object({
	name: z.string(),
})
export type RoomNameContent = z.infer<typeof RoomNameContent>
