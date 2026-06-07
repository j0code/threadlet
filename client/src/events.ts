import z from "zod"
import {
	EventContentMap,
	isSupported,
	SupportedEvents,
} from "./schemas/ClientEvent"
import { IContent } from "matrix-js-sdk"

// TODO: zod
export function parseEventContent<Type extends SupportedEvents>(
	type: Type,
	content: IContent
): z.infer<(typeof EventContentMap)[Type]> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
	if (!isSupported(type)) return content as any // this is for UnknownEvent

	const EventContent = EventContentMap[type]

	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
		return EventContent.parse(content) as any
	} catch (e) {
		console.error(`Failed to parse ${type} content:`, content, e)
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
