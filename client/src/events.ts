import z from "zod"
import { EventContentMap } from "./schemas/ClientEvent"
import { IContent } from "matrix-js-sdk"

export function parseEventContent<Type extends keyof typeof EventContentMap>(
	type: Type,
	content: IContent
): z.infer<(typeof EventContentMap)[Type]> {
	const EventContent = EventContentMap[type]

	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
		return EventContent.parse(content) as any
	} catch (e) {
		console.error(`Failed to parse ${String(type)} content:`, content, e)
		throw e
	}
}

/*
const parsedContent = { body: "", ...content } as UnknownIContent

	if (typeof content.body != "string") parsedContent.body = ""
	if ("formatted_body" in content && typeof content.formatted_body != "string")
		parsedContent.formatted_body = ""

	return parsedContent
	*/
