import z from "zod"
import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import { markdownToHtml } from "../../md"
import { UNKNOWN_EVENT_KEY } from "../../schemas/ClientEvent"
import { ZodError } from "zod"

export default class ErrorEvent extends ChatMessageBase<
	typeof UNKNOWN_EVENT_KEY
> {
	private readonly errorabc: unknown

	constructor(msg: MatrixEvent, error: unknown) {
		super(msg)
		this.element.dataset.eventType = "$error"
		this.errorabc = error
	}

	async reset(): Promise<void> {
		let errorMessage: string
		if (this.errorabc instanceof ZodError) {
			errorMessage = z.prettifyError(this.errorabc)
		} else if (this.errorabc instanceof Error) {
			errorMessage = this.errorabc.message
		} else {
			errorMessage = String(this.errorabc)
		}

		this.contentElement.innerHTML = markdownToHtml(
			`
Error parsing content of ${this.message.getType()} message:
\`\`\`json
${JSON.stringify(this.message.getContent(), undefined, "  ")}
\`\`\`
Error:
\`\`\`text
${errorMessage}
\`\`\`
		`.trim()
		)
		await super.reset()
	}

	get type() {
		return UNKNOWN_EVENT_KEY
	}
}
