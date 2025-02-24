import { Post } from "../api/types"
import PostAuthor from "./PostAuthor"
import PostContent from "./PostContent"
import View from "./View"
import { api } from "../main"
import ChatInput from "./ChatInput"
import MessageList from "./MessageList"

export default class PostView extends View {

	private currentForumId?: string
	private currentPostId?: string

	public readonly content: PostContent
	public readonly author: PostAuthor
	public readonly msgList: MessageList
	public readonly chatInput: ChatInput

	constructor() {
		super("div", { id: "post-view" })

		this.content   = new PostContent()
		this.author    = new PostAuthor()
		this.msgList   = new MessageList()
		this.chatInput = new ChatInput(this)

		this.body.appendChild(this.author.element)
		this.body.appendChild(this.content.element)
		this.body.appendChild(this.msgList.element)
		this.element.appendChild(this.chatInput.element)
	}

	async reset(post: Post) {
		this.head.reset(post.name)
		this.content.reset(post)
		this.msgList.reset(post)

		const user = await api.getUser(post.poster_id)
		this.author.reset(user)

		this.currentForumId = post.forum_id
		this.currentPostId  = post.id
	}

	getCurrentPostId() {
		return this.currentPostId
	}

	getCurrentForumId() {
		return this.currentForumId
	}

}
