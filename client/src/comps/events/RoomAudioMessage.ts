import { MatrixEvent } from "matrix-js-sdk"
import ChatMessageBase from "./ChatMessageBase"
import { getMXCData } from "../../matrix"

export default class RoomAudioMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""

		const audio = document.createElement("audio")
		audio.controls = true
		audio.src = (await getMXCData(this.message.getContent().url || "")) || ""
		audio.style.maxWidth = "50%"
		this.contentElement.appendChild(audio)
		await super.reset()
	}
}
