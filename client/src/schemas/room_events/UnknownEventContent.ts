import z from "zod"

export const UnknownEvent = z.object({})
export type UnknownEvent = z.infer<typeof UnknownEvent>
