import Component from "./Component"
import Form from "./Form"

export default class Modal extends Component {
	readonly form: Form

	constructor(form: Form) {
		super("dialog", { classes: ["modal"] })
		this.form = form
		this.element.setAttribute("closedBy", "any")
		this.element.appendChild(form.element)
		document.body.appendChild(this.element)
	}

	reset(...args: Parameters<Form["reset"]>) {
		this.form.reset(...args)
		this.form.element.addEventListener(
			"submit",
			() => {
				;(this.element as HTMLDialogElement).close()
			},
			{ once: true }
		)
	}

	show(...args: Parameters<Form["reset"]>) {
		this.reset(...args)
		;(this.element as HTMLDialogElement).showModal()
	}
}
