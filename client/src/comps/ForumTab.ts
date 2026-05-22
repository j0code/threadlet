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
		nameEl.textContent = twemojiParse(forum.name)
		this.tab = nameEl

		const ctxMenu = new ContextMenu("div", { classes: ["forum-tab-menu"] }, nameEl)
		ctxMenu.reset([
			{
				label: "Leave",
				action: () => {
					new ConfirmForm().openModal(
						`Are you sure you want to leave ${forum.name}?`,
						async (confirmed: boolean) => {
							if (!confirmed) return
							await matrix.leave(forum.roomId)
							app.updateChannelList()
							app.clearView()
						}
					)
				}
			}
		])

		this.element.appendChild(ctxMenu.element)
	}
}
