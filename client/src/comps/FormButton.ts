import Component from "./Component";

export default class FormButton extends Component {

	constructor(id: string, value: string, handler: (e: MouseEvent) => void) {
		super("input", id, "form-input form-button")

		const elem = this.element as HTMLInputElement
		elem.type = "button"
		elem.value = value
		elem.addEventListener("click", handler)
	}

}
