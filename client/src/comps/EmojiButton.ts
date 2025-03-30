import Component from "./Component"
import EmojiPicker, { EmojiMetaData } from "./EmojiPicker"

export default class EmojiButton extends Component {

	constructor(parentId: string, onEmojiSelect: (meta: EmojiMetaData) => void) {
		super("button", { id: parentId + "-emoji-button", classes: ["emoji-button"] })

		const elem = this.element as HTMLButtonElement
		elem.type = "button"
		elem.className = "overlay-emoji-button"
		elem.setAttribute("popovertarget", parentId + "-emoji-picker")
		elem.setAttribute("popovertargetaction", "show")

		// Emoji Picker
		const emojiPicker = new EmojiPicker(parentId + "-emoji-picker", parentId, onEmojiSelect)
		emojiPicker.element.classList.add("down")
		elem.append(emojiPicker.element)
	}

}
