import Avatar from "./Avatar"
import Component from "./Component"

export default class AvatarList extends Component {
	maxAvatars: number

	constructor(
		users: string[],
		{ classes = [], maxAvatars = 3 }: { classes?: string[]; maxAvatars: number }
	) {
		super("div", { id: "avatar-list", classes })
		this.maxAvatars = maxAvatars
		this.reset(users)
	}

	reset(users: string[]) {
		this.element.innerHTML = ""
		for (const user of users.slice(0, this.maxAvatars).toReversed()) {
			const avatar = new Avatar(user, "avatar-list-avatar")
			this.element.appendChild(avatar.element)
		}
	}
}
