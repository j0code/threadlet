import { IContent } from "matrix-js-sdk"
import { IContent as UnknownIContent } from "./types"

// TODO: zod
export function parseEventContent(content: IContent): UnknownIContent {
	const parsedContent = { body: "", ...content } as UnknownIContent

	if (typeof content.body != "string") parsedContent.body = ""
	if ("formatted_body" in content || typeof content.formatted_body != "string")
		parsedContent.formatted_body = ""

	return parsedContent
}
