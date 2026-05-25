import { app } from "../main"
import Component from "./Component"
import Form from "./forms/Form"

export default class Modal extends Component {
	readonly form: Form

	constructor(form: Form) {
		super("dialog", { classes: ["modal"] })
		this.form = form
		this.element.setAttribute("closedBy", "any")
		this.element.appendChild(form.element)

		this.element.addEventListener("cancel", event => {
			event.stopPropagation()
			app.closeModal(this)
		})

		this.form.element.addEventListener(
			"submit",
			() => {
				app.closeModal(this)
			},
			{ once: true }
		)
	}
}
