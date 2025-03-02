import { type Message as APIMessage } from "@j0code/threadlet-api/types"
import { markdownToHtml } from "../md"
import Component from "./Component"

export default class Message extends Component {

	constructor(msg: APIMessage) {
		super("div", { id: `message-${msg.id}`, classes: ["message"] })

		const content = document.createElement("div")
		content.className = "message-content md"
		content.innerHTML = markdownToHtml(msg.content)

		this.element.appendChild(content)
	}

}
