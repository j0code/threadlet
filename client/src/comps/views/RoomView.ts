import View from "../views//View"
import ChatInput from "../ChatInput"
import EventList from "../EventList"
import { MatrixEvent, MatrixEventEvent, Room, RoomEvent } from "matrix-js-sdk"
import { matrix } from "../../matrix"
import MemberList from "../MemberList"
import { parseEventContent } from "../../events"
import ChatMessageBase from "../events/ChatMessageBase"

export default class RoomView extends View {
	private currentRoom?: Room

	public readonly msgList: EventList
	public readonly chatInput: ChatInput
	public readonly memberList: MemberList

	private timelineEventHandler?: (event: MatrixEvent) => void
	private redactionEventHandler?: (event: MatrixEvent) => Promise<void>

	constructor() {
		super("div", { id: "room-view" })

		this.msgList = new EventList()
		this.chatInput = new ChatInput(this)
		this.memberList = new MemberList()

		const container = document.createElement("div")
		container.className = "post-container"

		const wrapper = document.createElement("div")
		wrapper.className = "room-wrapper"
		wrapper.appendChild(this.msgList.element)
		wrapper.appendChild(this.chatInput.element)
		container.appendChild(wrapper)

		this.body.appendChild(container)
		container.appendChild(this.memberList.element)
		container.style.flexDirection = "row"
	}

	onTimelineEvent(room: Room) {
		return (event: MatrixEvent) => {
			if (event.getRoomId() === room.roomId) {
				if (event.getContent()["m.relates_to"]?.rel_type === "m.replace") {
					const eventId = event.getContent()["m.relates_to"]?.event_id
					if (!eventId) return
					const comp = this.msgList.eventComponents.get(eventId)
					if (!comp) return
					if (!(comp instanceof ChatMessageBase)) return
					void comp.replaceEvent(event)
					this.msgList.eventComponents.set(event.getId()!, comp)
					return
				}
				this.msgList.pushMessage(event)
				if (event.isSending()) {
					const oldId = event.getId()
					if (!oldId) return
					event.once(MatrixEventEvent.LocalEventIdReplaced, (newEvent) => {
						console.log("Event ID replaced:", oldId, "->", newEvent.getId())
						const comp = this.msgList.eventComponents.get(oldId)
						this.msgList.eventComponents.delete(oldId)
						this.msgList.eventComponents.set(newEvent.getId()!, comp!)
					})
				}
			}
		}
	}

	onRedaction(room: Room) {
		return async (event: MatrixEvent) => {
			if (
				event.getRoomId() === room.roomId &&
				event.getType() === "m.room.redaction"
			) {
				const content = parseEventContent(event.getContent())
				if (!("redacts" in content) || typeof content.redacts !== "string")
					return
				const comp = this.msgList.eventComponents.get(content.redacts)
				if (!comp) return
				await comp.reset()
			}
		}
	}

	async reset(room: Room) {
		this.head.reset(room.name)
		await matrix.roomInitialSync(room.roomId, 20)
		const events = room.getLiveTimeline().getEvents()
		this.msgList.reset(events.filter(e => {
			return e.getContent()["m.relates_to"]?.rel_type !== "m.replace"
		}))

		if (this.timelineEventHandler)
			matrix.off(RoomEvent.Timeline, this.timelineEventHandler)
		if (this.redactionEventHandler)
			matrix.off(RoomEvent.Redaction, this.redactionEventHandler)

		this.currentRoom = room

		this.timelineEventHandler = this.onTimelineEvent(this.currentRoom)
		this.redactionEventHandler = this.onRedaction(this.currentRoom)
		matrix.on(RoomEvent.Timeline, this.timelineEventHandler)
		matrix.on(RoomEvent.Redaction, this.redactionEventHandler)

		this.updateMemberList(room)
	}

	updateMemberList(room: Room | null) {
		const members = matrix.getRoom(room?.roomId)?.getMembers() || []
		this.memberList.reset(members, room?.roomId)
	}

	getCurrentRoom() {
		return this.currentRoom
	}
}
