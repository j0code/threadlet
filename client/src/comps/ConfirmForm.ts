import { MaybePromise } from "../types"
import Form from "./Form"
import SubmitButton from "./SubmitButton"

export default class ConfirmForm extends Form {
	handler!: () => MaybePromise<void>

	constructor() {
		super("Confirm Action", { id: "confirm-form" })

		const confirmButton = new SubmitButton("confirm-button", "Confirm")
		this.body.appendChild(confirmButton.element)

		const cancelButton = new SubmitButton("cancel-button", "Cancel")
		this.body.appendChild(cancelButton.element)
	}

	reset(text: string, handler: () => MaybePromise<void>): void {
		this.handler = handler
		this.titleElement.textContent = text
	}

	async submit(id: string) {
		if (id === "confirm-button") {
			await this.handler()
		}
	}
}
