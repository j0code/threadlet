import Component from "./Component"
import EmojiButton from "./EmojiButton"

export default class FormTextInput extends Component {

	private readonly input: HTMLInputElement

	constructor(id: string, placeholder: string, min: number = 0, max: number = 16, emojiInput: boolean = false) {
		super("div", { id, classes: ["form-input", "form-text-input"] })

		this.input = document.createElement("input")
		this.input.type = "text"
		this.input.placeholder = placeholder
		this.input.minLength = min
		this.input.maxLength = max
		this.element.append(this.input)
		
		if (emojiInput) {
			const emojiButton = new EmojiButton(id, emoji => {
				this.input.value += emoji.native
			})
			this.element.append(emojiButton.element)
		}
	}

	get value() {
		return this.input.value
	}

	clear() {
		this.input.value = ""
	}

}
