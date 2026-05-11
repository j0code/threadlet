import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { getMXCData } from "../../matrix";

export default class RoomFileMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = ""
		
		const file = document.createElement("a")
		file.href = await getMXCData(this.message.getContent().url || "") || ""
		file.target = "_blank"
		file.rel = "noopener noreferrer"
		file.textContent = this.message.getContent().body || "Download File"
		this.contentElement.appendChild(file)
		await super.reset()
	}

}