import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { getMXCData } from "../../matrix";

export default class RoomVideoMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""
		
		const video = document.createElement("video")
		video.controls = true
		video.src = await getMXCData(this.message.getContent().url || "") || ""
		video.style.maxWidth = "50%"
		this.contentElement.appendChild(video)
		await super.reset()
	}

}