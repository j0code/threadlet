import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { markdownToHtml } from "../../md";
import { matrix } from "../../matrix";
import MXCImage from "../MXCImage";

export default class RoomFileMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		let file = document.createElement("a")
		file.href = await this.getMXCFile(this.message.getContent().url || "") || ""
		file.target = "_blank"
		file.rel = "noopener noreferrer"
		file.textContent = this.message.getContent().body || "Download File"
		this.contentElement.appendChild(file)
		super.reset()
	}

	async getMXCFile(mxc: string) {
		console.log("Getting media url for", mxc)
		// TODO: caching
		const url = matrix.mxcUrlToHttp(mxc, undefined, undefined, undefined, false, true, true)
		if(!url) {
			return null
		}
		const img = await fetch(url, {
			headers: {
				Authorization: `Bearer ${matrix.getAccessToken()}`
			}
		})
		const blob = await img.blob()
		return URL.createObjectURL(blob)
	}

}