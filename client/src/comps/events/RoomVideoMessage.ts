import { MatrixEvent } from "matrix-js-sdk";
import ChatMessageBase from "./ChatMessageBase";
import { markdownToHtml } from "../../md";
import { matrix } from "../../matrix";
import MXCImage from "../MXCImage";

export default class RoomVideoMessage extends ChatMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg)
	}

	async reset(): Promise<void> {
		let video = document.createElement("video")
		video.controls = true
		video.src = await this.getMXCVideo(this.message.getContent().url || "") || ""
		video.style.maxWidth = "50%"
		this.contentElement.appendChild(video)
		super.reset()
	}

	async getMXCVideo(mxc: string) {
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