import Component from "./Component";
import Form from "./Form";

export default class Modal extends Component {
	readonly form: Form

	constructor(form: Form) {
		super("dialog", { classes: ["modal"] })
		this.form = form
		this.element.appendChild(form.element)
		this.element.addEventListener("close", () => {
			if(this.element.isConnected) this.element.remove()
		})
	}

	reset(...args: Parameters<Form["reset"]>) {
		this.form.reset(...args)
		this.form.element.addEventListener("submit", () => {
			(this.element as HTMLDialogElement).close()
			if(this.element.isConnected) this.element.remove()
		}, { once: true })
	}

	show() {
		document.body.appendChild(this.element)
		;(this.element as HTMLDialogElement).showModal()
	}
}
