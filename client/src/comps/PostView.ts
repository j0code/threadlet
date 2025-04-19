import { Post } from "@j0code/threadlet-api/v0/types"
import PostAuthor from "./PostAuthor"
import PostContent from "./PostContent"
import View from "./View"
import { api } from "../main"
import ChatInput from "./ChatInput"
import MessageList from "./MessageList"
import TagList from "./TagList"

export default class PostView extends View {

	private currentForumId?: string
	private currentPostId?: string

	public readonly author: PostAuthor
	private tagList: TagList
	public readonly content: PostContent
	public readonly msgList: MessageList
	public readonly chatInput: ChatInput

	constructor() {
		super("div", { id: "post-view" })

		this.author    = new PostAuthor()
		this.tagList   = new TagList()
		this.content   = new PostContent()
		this.msgList   = new MessageList()
		this.chatInput = new ChatInput(this)

		const container = document.createElement("div")
		container.className = "post-container"
		container.appendChild(this.content.element)
		container.appendChild(this.msgList.element)

		this.body.appendChild(this.author.element)
		this.body.appendChild(this.tagList.element)
		this.body.appendChild(container)
		this.element.appendChild(this.chatInput.element)
	}

	async reset(postId: string) {
		const post = await api.getPost("44", postId)

		this.head.reset(post.name)
		this.tagList.reset(post.tags ?? [])
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
