import Component from "./Component";

export default class ForumTab extends Component {

	constructor(forum: any) {
		super("div", "tab-forum", "list-tab")

		this.element.textContent = forum.name
	}

}
