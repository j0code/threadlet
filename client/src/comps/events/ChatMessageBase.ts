import { twemojiParse } from "../../md"
import { Direction, IContent, MatrixEvent } from "matrix-js-sdk"
import { getMXUser, matrix } from "../../matrix"
import EventBase from "./EventBase"
import { relativeTimeFormat } from "../../intl"
import ContextMenu, { ContextMenuItem } from "../ContextMenu"
import ConfirmForm from "../forms/ConfirmForm"
import { app } from "../../main"
import RoomView from "../views/RoomView"

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

		const room = matrix.getRoom(this.message.getRoomId())

		const ctxMenu = new ContextMenu("message-menu", this.element)
		const ctxMenuItems: ContextMenuItem[] = []
		const isMyEvent = this.message.getSender() === matrix.getUserId()
		const canRedact =
			isMyEvent ||
			room
				?.getLiveTimeline()
				.getState(Direction.Forward)
				?.maySendRedactionForEvent(this.message, matrix.getUserId()!)
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
							await matrix.fetchRoomEvent(
								this.message.getRoomId()!,
								this.message.getId()!
							)
							await this.reset()
						}
					).openModal()
				},
			})
		}
		if (isMyEvent) {
			ctxMenuItems.push({
				label: "Replace",
				action: () => {
					if (!this.message) return
					const view = app.getCurrentView()
					if (!(view instanceof RoomView)) return
					view.chatInput.startReplacement(this.message)
				}
			})
		}

		ctxMenu.reset(ctxMenuItems)
		this.element.appendChild(ctxMenu.element)

		void this.reset()
	}

	async replaceEvent(event: MatrixEvent) {
		this.message = event
		await this.reset()
	}

	getContent() {
		const content = this.message.getContent()
		if (content["m.relates_to"]?.rel_type === "m.replace") {
			return content["m.new_content"] as IContent || content
		}
		return content
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

		if (msg.isRedacted()) {
			this.contentElement.classList.add("redacted")
			this.contentElement.textContent = "(redacted)"
			return
		}

		console.log("Resetting message:", msg.getId(), msg.getContent())
		if (msg.getContent()["m.relates_to"]?.rel_type === "m.replace" || msg.getOriginalContent() != msg.getContent()) {
			const replacedMarker = document.createElement("span")
			replacedMarker.className = "replaced-marker"
			replacedMarker.textContent = " (replaced)"
			this.contentElement.appendChild(replacedMarker)
			return
		}

		this.contentElement
			.querySelectorAll<HTMLSpanElement>("[data-mx-spoiler]")
			.forEach(el => {
				el.addEventListener("click", () => el.classList.toggle("revealed"))
			})
	}
}
