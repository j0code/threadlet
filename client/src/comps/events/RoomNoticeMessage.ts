import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { markdownToHtml } from "../../md";
import { matrix } from "../../matrix";
import MXCImage from "../MXCImage";
import { purifyHTML } from "./HTMLFormat";

export default class RoomNoticeMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		switch (this.message.getContent().format) {
			case "org.matrix.custom.html":
				this.contentElement.innerHTML = purifyHTML(this.message.getContent().formatted_body || "")
				break
			case "org.matrix.custom.markdown": // This is not official, but its useful. Should it be renamed to something else because its not official?
				this.contentElement.innerHTML = markdownToHtml(this.message.getContent().body || "")
				break
			case undefined:
			default:
				this.contentElement.innerHTML = this.message.getContent().body || ""
				break
		}
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