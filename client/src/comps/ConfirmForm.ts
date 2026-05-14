import { MaybePromise } from "../types";
import Form from "./Form";
import SubmitButton from "./SubmitButton";

export default class ConfirmForm extends Form {
	handler!: () => MaybePromise<void>

	constructor() {
		super("Confirm Action", { id: "confirm-form" })
	}

	reset(text: string, handler: () => MaybePromise<void>): void {
		this.handler = handler
		this.body.innerHTML = ""
		this.titleElement.textContent = text

		const confirmButton = new SubmitButton("confirm-button", "Confirm");
		this.body.appendChild(confirmButton.element)

		const cancelButton = new SubmitButton("cancel-button", "Cancel");
		this.body.appendChild(cancelButton.element)
	}

	async submit(id: string) {
		if (id === "confirm-button") {
			await this.handler()
		}
	}
}