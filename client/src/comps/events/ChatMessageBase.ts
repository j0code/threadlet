import { type Message as APIMessage } from "@j0code/threadlet-api/v0/types"
import { markdownToHtml, twemojiParse } from "../../md"
import Component from "../Component"
import CDN from "@j0code/threadlet-api/v0/cdn"
import { api, clientUser } from "../../main"
import twemoji from "@discordapp/twemoji"
import { MatrixEvent } from "matrix-js-sdk"
import { matrix } from "../../matrix"
import Avatar from "../Avatar"
import EventBase from "./EventBase"

export default class ChatMessageBase extends EventBase {

	readonly contentElement:   HTMLDivElement
	readonly avatarElement:    Avatar
	readonly nameElement:      HTMLSpanElement
	readonly timestampElement: HTMLTimeElement

	constructor(msg: MatrixEvent) {
		super(msg, "div", { id: `message-${msg.getId()}`, classes: ["message"] })

		this.contentElement = document.createElement("div")
		this.contentElement.className = "message-content md"

		this.avatarElement = new Avatar(msg.getSender()!, "message-author-avatar")

		this.nameElement = document.createElement("span")
		this.nameElement.className = "message-author-name"

		this.timestampElement = document.createElement("time")
		this.timestampElement.className = "message-timestamp"

		const aside = document.createElement("div")
		aside.className = "message-aside"
		aside.append(this.avatarElement.element)

		const header = document.createElement("div")
		header.className = "message-header"
		header.append(this.nameElement, this.timestampElement)

		const main = document.createElement("div")
		main.className = "message-main"
		main.append(header, this.contentElement)

		this.element.append(aside, main)

		this.reset()
	}

	async reset() {
		const msg = this.message
		const user = matrix.getUser(msg.getSender()!)
		let displayname = user?.displayName
		if(!user) {
			const profile = await matrix.getProfileInfo(msg.getSender()!)
			displayname = profile?.displayname || msg.getSender()
		}
		this.nameElement.innerHTML = twemojiParse(displayname || msg.getSender() || "Unknown")
		this.timestampElement.dateTime = msg.getDate()?.toISOString() || ""
		// this.timestampElement.textContent = msg.getDate()?.toISOString() || ""
		this.timestampElement.textContent = await this.relativeTimeFormat(msg.getDate() || new Date())
	}

	async relativeTimeFormat(date: Date) {
		const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
		const now = new Date()
		const diff = (date.getTime() - now.getTime()) / 1000

		if (Math.abs(diff) < 60) {
			return rtf.format(Math.round(diff), "second")
		} else if (Math.abs(diff) < 3600) {
			return rtf.format(Math.round(diff / 60), "minute")
		} else if (Math.abs(diff) < 86400) {
			return rtf.format(Math.round(diff / 3600), "hour")
		} else {
			return rtf.format(Math.round(diff / 86400), "day")
		}
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
