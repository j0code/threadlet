import { Room } from "matrix-js-sdk";
import { matrix } from "../matrix";
import { twemojiParse } from "../md";
import Component from "./Component";
import ContextMenu from "./ContextMenu";
import { app } from "../main";

export default class ForumTab extends Component {

	readonly tab: HTMLElement

	constructor(forum: Room) {
		super("div", { classes: ["list-tab"] })

		const ctxMenu = new ContextMenu("div", { classes: ["forum-tab-menu"] })

		const leaveButton = document.createElement("div")
		leaveButton.textContent = "Leave"
		leaveButton.addEventListener("click", async () => {
			if(!confirm(`Are you sure you want to leave ${forum.name}?`)) return
			await matrix.leave(forum.roomId)
			app.updateChannelList()
			app.renderView(undefined)
		})
		ctxMenu.content.appendChild(leaveButton)

		this.tab = ctxMenu.trigger
		ctxMenu.trigger.innerHTML = twemojiParse(forum.name)

		this.element.appendChild(ctxMenu.element)
	}
}
