import z from "zod"

export const RoomCanonicalAliasContent = z.object({
	alias: z.string().default(""),
	alt_aliases: z.array(z.string()).default([]),
})
export type RoomCanonicalAliasContent = z.infer<
	typeof RoomCanonicalAliasContent
>
