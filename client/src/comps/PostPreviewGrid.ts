import { Forum } from "@j0code/threadlet-api/types";
import { api } from "../main";
import Component from "./Component";
import PostPreview from "./PostPreview";

export default class PostPreviewGrid extends Component {

	constructor() {
		super("div", { id: "post-previews" })
	}

	async reset(forum: Forum) {
		const posts = await api.getPosts(forum.id)

		for (let child of Array.from(this.element.children)) {
			child.remove()
		}
		
		for (let post of posts) {
			const preview = new PostPreview(post)
			//preview.element.addEventListener("click", () => app.renderView(views.forumView, forum))
			this.element.appendChild(preview.element)
		}
	}

}
