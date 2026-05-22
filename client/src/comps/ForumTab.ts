import { Room } from "matrix-js-sdk"
import { matrix } from "../matrix"
import { twemojiParse } from "../md"
import Component from "./Component"
import ContextMenu from "./ContextMenu"
import { app } from "../main"
import ConfirmForm from "./ConfirmForm"

export default class ForumTab extends Component {
	readonly tab: HTMLElement

	constructor(forum: Room) {
		super("div", { classes: ["list-tab"] })

		const nameEl = document.createElement("span")
		nameEl.innerHTML = twemojiParse(forum.name)
		this.tab = nameEl
		this.element.appendChild(nameEl)

		const ctxMenu = new ContextMenu("forum-tab-menu", this.element)
		ctxMenu.reset([
			{
				label: "Leave",
				action: () => {
					new ConfirmForm(
						`Are you sure you want to leave ${forum.name}?`,
						async (confirmed: boolean) => {
							if (!confirmed) return
							await matrix.leave(forum.roomId)
							app.updateChannelList()
							app.clearView()
						}
					).openModal()
				},
			},
		])

		this.element.appendChild(ctxMenu.element)
	}
}
