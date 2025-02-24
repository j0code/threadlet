import Component from "./Component"

export default class FormTextInput extends Component {

	constructor(id: string, placeholder: string, min: number = 0, max: number = 16) {
		super("input", { id, classes: ["form-input", "form-text-input"] })

		const elem = this.element as HTMLInputElement
		elem.type = "text"
		elem.placeholder = placeholder
		elem.minLength = min
		elem.maxLength = max
	}

	get value() {
		const elem = this.element as HTMLInputElement
		return elem.value
	}

	clear() {
		const elem = this.element as HTMLInputElement
		elem.value = ""
	}

}
