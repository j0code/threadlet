import pickerData from "@emoji-mart/data"
import { Picker } from "emoji-mart"
import Component from "./Component"

export type EmojiMetaData = {
	id: string
	native: string
}

const pickerOptions = {
	data: pickerData,
	autoFocus: true,
	icons: "solid",
	set: "native",
	previewPosition: "bottom"
}

export default class EmojiPicker extends Component {

	constructor(id: string, anchor_id: string, onEmojiSelect: (meta: EmojiMetaData) => void) {
		super("div", { classes: ["emoji-picker-container"] })

		const options = { ...pickerOptions, onEmojiSelect }

		const picker = new Picker(options) as unknown as HTMLElement
		picker.id = id
		picker.className = "emoji-picker"
		picker.setAttribute("anchor", anchor_id)
		picker.setAttribute("popover", "")

		this.element.append(picker)
	}

	showPopover() {
		this.element.showPopover()
	}

}
