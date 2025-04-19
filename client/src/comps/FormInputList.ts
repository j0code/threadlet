import Component from "./Component"
import FormButton from "./FormButton"
import FormTextInput from "./FormTextInput"

export default class FormInputList extends Component {

	private readonly parentId: string

	private readonly inputs: FormTextInput[]

	private readonly inputList: HTMLDivElement

	constructor(id: string) {
		super("div", { id, classes: ["form-input", "form-input-list"] })
		this.parentId = id

		this.inputList = document.createElement("div")

		const firstInput = new FormTextInput(`${id}-0`, "")
		this.inputList.append(firstInput.element)

		const plusButton = new FormButton(`${id}-plus`, "+", () => this.pushInput())

		this.element.append(this.inputList, plusButton.element)

		this.inputs = [firstInput]
	}

	pushInput() {
		const input = new FormTextInput(`${this.parentId}-${this.inputList.childElementCount}`, "")
		this.inputs.push(input)
		this.inputList.append(input.element)
	}

	popInput() {
		if (this.inputs.length <= 1) return
		this.inputs[this.inputs.length - 1].element.remove()
		this.inputs.pop()
	}

	get value() {
		const values = []

		for (let input of this.inputs) {
			const value = input.value.trim()
			if (value) values.push(value)
		}

		return values
	}

}
