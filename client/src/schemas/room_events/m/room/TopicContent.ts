import z from "zod"

const TextualRepresentation = z.object({
	body: z.string(),
	mimetype: z.string().default("text/plain"),
})
export type TextualRepresentation = z.infer<typeof TextualRepresentation>

const TopicContentBlock = z.object({
	"m.text": z.array(TextualRepresentation),
})
export type TopicContentBlock = z.infer<typeof TopicContentBlock>

export const RoomTopicContent = z.object({
	"m.topic": TopicContentBlock.optional(),
	topic: z.string(),
})
export type RoomTopicContent = z.infer<typeof RoomTopicContent>
