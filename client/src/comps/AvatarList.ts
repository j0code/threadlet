import Avatar from "./Avatar";
import Component from "./Component";

export default class AvatarList extends Component {
	constructor(users: string[], classes: string[] = []) {
		super("div", { id: "avatar-list", classes })
		this.reset(users)
	}

	reset(users: string[]) {
		this.element.innerHTML = ""
		for (const user of users.toReversed().slice(0, 3)) {
			const avatar = new Avatar(user, "avatar-list-avatar")
			this.element.appendChild(avatar.element)
		}
	}
}
