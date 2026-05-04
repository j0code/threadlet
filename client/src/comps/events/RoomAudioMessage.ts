import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { markdownToHtml } from "../../md";
import { getMXCData, matrix } from "../../matrix";
import MXCImage from "../MXCImage";

export default class RoomAudioMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""
		
		let audio = document.createElement("audio")
		audio.controls = true
		audio.src = await getMXCData(this.message.getContent().url || "") || ""
		audio.style.maxWidth = "50%"
		this.contentElement.appendChild(audio)
		super.reset()
	}

}