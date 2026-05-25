import { MaybePromise } from "../../types"
import Form from "./Form"
import SubmitButton from "../form-comps/SubmitButton"

export default class ConfirmForm extends Form {
	handler!: (confirmed: boolean) => MaybePromise<void>

	constructor(
		title = "Confirm Action",
		handler: (confirmed: boolean) => MaybePromise<void>
	) {
		super(title, { id: "confirm-form" })
		this.handler = handler

		const confirmButton = new SubmitButton("confirm-button", "Confirm")
		this.body.appendChild(confirmButton.element)

		const cancelButton = new SubmitButton("cancel-button", "Cancel")
		this.body.appendChild(cancelButton.element)
	}

	reset(): void {}

	async submit(id: string) {
		await this.handler(id === "confirm-button")
	}
}
