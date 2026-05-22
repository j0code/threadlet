import { twemojiParse } from "../../md"
import { MatrixEvent } from "matrix-js-sdk"
import { getMXUser, matrix } from "../../matrix"
import EventBase from "./EventBase"
import { relativeTimeFormat } from "../../intl"
import ContextMenu, { ContextMenuItem } from "../ContextMenu"
import ConfirmForm from "../ConfirmForm"

export default class ChatMessageBase extends EventBase {
	constructor(msg: MatrixEvent) {
		super(msg, "div", { id: `message-${msg.getId()}`, classes: ["message"] })

		const header = document.createElement("div")
		header.className = "message-header"
		header.append(this.nameElement, this.timestampElement)

		this.asideElement.append(this.avatar.element)
		this.mainElement.append(header, this.contentElement)

		const content = this.message.getContent()
		this.element.dataset.msgtype = content.msgtype || "m.text"

		const ctxMenu = new ContextMenu("message-menu", this.element)
		const ctxMenuItems: ContextMenuItem[] = []
		const canRedact = !this.message?.isRedacted()
		if (canRedact) {
			ctxMenuItems.push({
				label: "Redact",
				action: () => {
					if (!this.message) return
					new ConfirmForm(
						`Are you sure you want to redact this message?`,
						async (confirmed: boolean) => {
							if (!confirmed) return
							await matrix.redactEvent(
								this.message.getRoomId()!,
								this.message.getId()!
							)
							await matrix.fetchRoomEvent(this.message.getRoomId()!, this.message.getId()!)
							await this.reset()
						}
					).openModal()
				},
			})
		}

		ctxMenu.reset(ctxMenuItems)
		this.element.appendChild(ctxMenu.element)

		void this.reset()
	}

	async reset() {
		const msg = this.message
		const { displayname } = await getMXUser(msg.getSender()!)
		this.nameElement.innerHTML = twemojiParse(
			displayname || msg.getSender() || "Unknown"
		)
		this.timestampElement.dateTime = msg.getDate()?.toISOString() || ""
		// this.timestampElement.textContent = msg.getDate()?.toISOString() || ""
		this.timestampElement.textContent = relativeTimeFormat(
			msg.getDate() || new Date()
		)

		this.contentElement
			.querySelectorAll<HTMLSpanElement>("[data-mx-spoiler]")
			.forEach(el => {
				el.addEventListener("click", () => el.classList.toggle("revealed"))
			})
	}
}
