import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { markdownToHtml } from "../../md";
import { matrix } from "../../matrix";
import MXCImage from "../MXCImage";

export default class RoomTextMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		this.contentElement.innerHTML = markdownToHtml(this.message.getContent().body || "```json\n" + JSON.stringify(this.message.getContent()) + "\n```")
		this.contentElement.style.color = "#acacac"
		super.reset()
	}

	async getMXCImage(mxc: string) {
		console.log("Getting avatar url for", mxc)
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