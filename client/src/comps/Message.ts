import { type Message as APIMessage } from "@j0code/threadlet-api/v0/types"
import { markdownToHtml, twemojiParse } from "../md"
import Component from "./Component"
import CDN from "@j0code/threadlet-api/v0/cdn"
import { api, clientUser } from "../main"
import twemoji from "@discordapp/twemoji"

export default class Message extends Component {

	readonly message: APIMessage

	readonly contentElement:   HTMLDivElement
	readonly avatarElement:    HTMLImageElement
	readonly nameElement:      HTMLSpanElement
	readonly timestampElement: HTMLTimeElement

	constructor(msg: APIMessage) {
		super("div", { id: `message-${msg.id}`, classes: ["message"] })
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

		this.reset()
	}

	async reset() {
		const msg = this.message
		this.contentElement.innerHTML = markdownToHtml(msg.content)

		const user = await api.getUser(msg.author_id)
		// this.avatarElement.src = CDN.avatar(msg.author_id, user.avatar)
		this.avatarElement.src = user.avatar || ""
		this.nameElement.innerHTML = twemojiParse(user.name)
		this.timestampElement.dateTime = msg.created_at
		this.timestampElement.textContent = new Date(msg.created_at).toLocaleString(clientUser.locale)
	}

}
