import { Forum } from "../api/types";
import { api } from "../main";
import Component from "./Component";
import PostPreview from "./PostPreview";

export default class PostPreviewGrid extends Component {

	constructor() {
		super("div", "post-previews")
	}

	async reset(forum: Forum) {
		for (let child of Array.from(this.element.children)) {
			child.remove()
		}

		const posts = await api.getPosts(forum.id)
		
		for (let post of posts) {
			const preview = new PostPreview(post)
			//preview.element.addEventListener("click", () => app.renderView(views.forumView, forum))
			this.element.appendChild(preview.element)
		}
	}

}
