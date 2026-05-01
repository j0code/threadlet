import { type Message as APIMessage } from "@j0code/threadlet-api/v0/types"
import { markdownToHtml, twemojiParse } from "../md"
import Component from "./Component"
import CDN from "@j0code/threadlet-api/v0/cdn"
import { api, clientUser } from "../main"
import twemoji from "@discordapp/twemoji"
import { MatrixEvent } from "matrix-js-sdk"
import { matrix } from "../matrix"

export default class Message extends Component {

	readonly message: MatrixEvent

	readonly contentElement: HTMLDivElement
	readonly avatarElement: HTMLImageElement
	readonly nameElement: HTMLSpanElement
	readonly timestampElement: HTMLTimeElement

	constructor(msg: MatrixEvent) {
		super("div", { id: `message-${msg.getId()}`, classes: ["message"] })
		this.message = msg

		this.contentElement = document.createElement("div")
		this.contentElement.className = "message-content md"

		this.avatarElement = document.createElement("img")
		this.avatarElement.className = "message-author-avatar"

		this.nameElement = document.createElement("span")
		this.nameElement.className = "message-author-name"

		this.timestampElement = document.createElement("time")
		this.timestampElement.className = "message-timestamp"

		const aside = document.createElement("div")
		aside.className = "message-aside"
		aside.append(this.avatarElement)

		const header = document.createElement("div")
		header.className = "message-header"
		header.append(this.nameElement, this.timestampElement)

		const main = document.createElement("div")
		main.className = "message-main"
		main.append(header, this.contentElement)

		this.element.append(aside, main)

		void this.reset()
	}

	async reset() {
		const msg = this.message
		this.contentElement.innerHTML = markdownToHtml(msg.getContent().body || "```json\n" + JSON.stringify(msg.getContent()) + "\n```")

		let { avatar_url, displayname } = await matrix.getProfileInfo(msg.getSender()!) // TODO: cache
		this.avatarElement.src = await this.getAvatarUrl(avatar_url || "") || ""
		this.nameElement.innerHTML = twemojiParse(displayname || msg.getSender() || "Unknown")
		this.timestampElement.dateTime = msg.getDate()?.toISOString() || ""
		this.timestampElement.textContent = msg.getDate()?.toISOString() || ""
	}

	async getAvatarUrl(mxc: string) {
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
