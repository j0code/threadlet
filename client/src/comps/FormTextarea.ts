import Component from "./Component"
import EmojiButton from "./EmojiButton"

export default class FormTextarea extends Component {

	private readonly textarea: HTMLTextAreaElement

	constructor(id: string, placeholder: string, min: number = 0, max: number = 256, emojiInput: boolean = true) {
		super("div", { id, classes: ["form-input", "form-textarea"] })

		this.textarea = document.createElement("textarea")
		this.textarea.placeholder = placeholder
		this.textarea.minLength = min
		this.textarea.maxLength = max
		this.element.append(this.textarea)

		if (emojiInput) {
			const emojiButton = new EmojiButton(id, emoji => {
				this.textarea.value += emoji.native
			})
			this.element.append(emojiButton.element)
		}
	}

	get value() {
		return this.textarea.value
	}

	clear() {
		this.textarea.value = ""
	}

}
