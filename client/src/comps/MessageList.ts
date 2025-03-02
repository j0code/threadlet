import { type Post } from "@j0code/threadlet-api/types"
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
			const comp = new Message(msg)
			this.element.appendChild(comp.element)
		}
	}

}
