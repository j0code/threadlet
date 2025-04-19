import { type Post, type Message as APIMessage } from "@j0code/threadlet-api/v0/types"
import { api } from "../main"
import Component from "./Component"
import Message from "./Message"

export default class MessageList extends Component {

	constructor() {
		super("div", { id: `messages` })
	}

	async reset(post: Post) {
		for (let child of Array.from(this.element.children)) {
			child.remove()
		}

		const msgs = await api.getMessages(post.forum_id, post.id)
		
		for (let msg of msgs) {
			this.pushMessage(msg)
		}

		this.element.scrollTop = this.element.scrollHeight
	}

	pushMessage(msg: APIMessage) {
		const autoscroll = this.element.scrollTop + this.element.clientHeight >= this.element.scrollHeight - 10

		const comp = new Message(msg)
		this.element.appendChild(comp.element)

		if (autoscroll) {
			this.element.scrollTo({
				top: this.element.scrollHeight,
				behavior: "smooth"
			})
		}
	}

}
