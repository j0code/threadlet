import Component from "./Component"

export default class FormCheckbox extends Component {

	private readonly input: HTMLInputElement
	private readonly label: HTMLSpanElement

	constructor(id: string, label: string) {
		super("div", { id, classes: ["form-input", "form-checkbox-input"] })

		this.input = document.createElement("input")
		this.input.type = "checkbox"
		this.element.append(this.input)

		this.label = document.createElement("span")
		this.label.textContent = label
		this.element.append(this.label)
	}

	get value() {
		return this.input.checked
	}

	clear() {
		this.input.checked = false
	}

}
