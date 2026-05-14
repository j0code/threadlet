import Component from "./Component"

export default class FormButton extends Component {
	constructor(id: string, value: string, handler: (e: MouseEvent) => void, type = "button") {
		super("input", { id, classes: ["form-input", "form-button"] })

		const elem = this.element as HTMLInputElement
		elem.type = type
		elem.value = value
		elem.addEventListener("click", handler)
	}
}
