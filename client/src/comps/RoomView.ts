import { Post } from "@j0code/threadlet-api/v0/types"
import PostAuthor from "./PostAuthor"
import PostContent from "./PostContent"
import View from "./View"
import { api } from "../main"
import ChatInput from "./ChatInput"
import EventList from "./EventList"
import TagList from "./TagList"
import { MatrixEvent, Room, RoomEvent, RoomMember } from "matrix-js-sdk"
import { matrix } from "../matrix"
import MemberList from "./MemberList"

export default class RoomView extends View {

	private currentRoom?: Room

	public readonly msgList: EventList
	public readonly chatInput: ChatInput
	public readonly memberList: MemberList

	private timelineEventHandler?: (event: MatrixEvent) => void

	constructor() {
		super("div", { id: "room-view" })

		this.msgList   = new EventList()
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
		return async (event: MatrixEvent) => {
			if(event.getRoomId() === room.roomId) {
				this.msgList.pushMessage(event);
			}
		};
	}

	async reset(room: Room) {
		this.head.reset(room.name)
		await matrix.roomInitialSync(room.roomId, 20);
		const events = room.getLiveTimeline().getEvents()
		this.msgList.reset(events)

		if(this.timelineEventHandler) matrix.off(RoomEvent.Timeline, this.timelineEventHandler);

		this.currentRoom = room

		this.timelineEventHandler = this.onTimelineEvent(this.currentRoom)
		matrix.on(RoomEvent.Timeline, this.timelineEventHandler);

		this.updateMemberList(room)
	}

	async updateMemberList(room: Room | null) {
		const members = matrix.getRoom(room?.roomId)?.getMembers() || []
		await this.memberList.reset(members, room?.roomId)
	}

	getCurrentRoom() {
		return this.currentRoom
	}

}
