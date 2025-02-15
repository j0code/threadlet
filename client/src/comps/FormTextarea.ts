import Component from "./Component"

export default class FormTextarea extends Component {

	constructor(id: string, placeholder: string, min: number = 0, max: number = 256) {
		super("textarea", id, "form-input form-textarea")

		const elem = this.element as HTMLInputElement
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
