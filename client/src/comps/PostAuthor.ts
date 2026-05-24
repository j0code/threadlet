import Component from "./Component"
import { twemojiParse } from "../md"

export default class PostAuthor extends Component {
	private readonly avatar: HTMLImageElement
	private readonly name: HTMLSpanElement

	constructor() {
		super("div", { classes: ["post-author"] })

		this.avatar = document.createElement("img")
		this.avatar.className = "post-author-avatar"

		this.name = document.createElement("span")
		this.name.className = "post-author-name"

		this.element.append(this.avatar, this.name)
	}

	reset(user: unknown) {
		/*
		this.avatar.src = CDN.avatar(user.id, user.avatar)
		this.name.innerHTML = twemojiParse(user.name)
		*/
	}
}
