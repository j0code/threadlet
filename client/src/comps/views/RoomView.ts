import View from "../views//View"
import ChatInput from "../ChatInput"
import EventList from "../EventList"
import { MatrixEvent, Room, RoomEvent, RoomMember, RoomMemberEvent } from "matrix-js-sdk"
import { matrix } from "../../matrix"
import MemberList from "../MemberList"
import { parseEventContent } from "../../events"
import TypingIndicator from "../TypingIndicator"

export default class RoomView extends View {
	private currentRoom?: Room

	public readonly msgList: EventList
	public readonly chatInput: ChatInput
	public readonly memberList: MemberList
	public readonly typingIndicator: TypingIndicator

	private timelineEventHandler?: (event: MatrixEvent) => void
	private redactionEventHandler?: (event: MatrixEvent) => Promise<void>
	private typingEventHandler?: (event: MatrixEvent) => void

	public typingUsers: RoomMember[] = []

	constructor() {
		super("div", { id: "room-view" })

		this.msgList = new EventList()
		this.chatInput = new ChatInput(this)
		this.memberList = new MemberList()
		this.typingIndicator = new TypingIndicator()

		const container = document.createElement("div")
		container.className = "post-container"

		const wrapper = document.createElement("div")
		wrapper.className = "room-wrapper"
		wrapper.appendChild(this.msgList.element)
		wrapper.appendChild(this.typingIndicator.element)
		wrapper.appendChild(this.chatInput.element)
		container.appendChild(wrapper)

		this.body.appendChild(container)
		container.appendChild(this.memberList.element)
		container.style.flexDirection = "row"
	}

	onTimelineEvent(room: Room) {
		return (event: MatrixEvent) => {
			if (event.getRoomId() === room.roomId) {
				this.msgList.pushMessage(event)
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

	onTypingEvent(room: Room) {
		return () => {
			this.updateTypingIndicator(room)
		}
	}

	updateTypingIndicator(room: Room) {
		this.typingUsers = room
			.getMembers()
			.filter(m => m.typing && m.userId !== matrix.getUserId())
		this.typingIndicator.reset(this.typingUsers)
	}

	async reset(room: Room) {
		this.head.reset(room.name)
		await matrix.roomInitialSync(room.roomId, 20)
		const events = room.getLiveTimeline().getEvents()
		this.msgList.reset(events)
		this.updateTypingIndicator(room)

		if (this.timelineEventHandler)
			matrix.off(RoomEvent.Timeline, this.timelineEventHandler)
		if (this.redactionEventHandler)
			matrix.off(RoomEvent.Redaction, this.redactionEventHandler)
		if (this.typingEventHandler)
			matrix.off(RoomMemberEvent.Typing, this.typingEventHandler)

		this.currentRoom = room

		this.timelineEventHandler = this.onTimelineEvent(this.currentRoom)
		this.redactionEventHandler = this.onRedaction(this.currentRoom)
		this.typingEventHandler = this.onTypingEvent(this.currentRoom)
		matrix.on(RoomEvent.Timeline, this.timelineEventHandler)
		matrix.on(RoomEvent.Redaction, this.redactionEventHandler)
		matrix.on(RoomMemberEvent.Typing, this.typingEventHandler)

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
