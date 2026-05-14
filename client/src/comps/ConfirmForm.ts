import { MaybePromise } from "../types";
import Form from "./Form";
import FormButton from "./FormButton";

export default class ConfirmForm extends Form {
	constructor() {
		super("Confirm Action", { id: "confirm-form" })
	}

	reset(text: string, handler: () => MaybePromise<void>): void {
		this.body.innerHTML = ""
		this.titleElement.textContent = text

		const confirmButton = new FormButton("confirm-button", "Confirm", async () => {
			await handler()
			this.element.dispatchEvent(new Event("submit"))
		}, "submit")
		this.body.appendChild(confirmButton.element)

		const cancelButton = new FormButton("cancel-button", "Cancel", () => {
			this.element.dispatchEvent(new Event("submit"))
		}, "submit")
		this.body.appendChild(cancelButton.element)
	}
}