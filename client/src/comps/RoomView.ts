import { Post } from "@j0code/threadlet-api/v0/types"
import PostAuthor from "./PostAuthor"
import PostContent from "./PostContent"
import View from "./View"
import { api } from "../main"
import ChatInput from "./ChatInput"
import MessageList from "./MessageList"
import TagList from "./TagList"
import { MatrixEvent, Room, RoomEvent } from "matrix-js-sdk"
import { matrix } from "../matrix"

export default class RoomView extends View {

	private currentRoom?: Room

	public readonly msgList: MessageList
	public readonly chatInput: ChatInput

	constructor() {
		super("div", { id: "room-view" })

		this.msgList   = new MessageList()
		this.chatInput = new ChatInput(this)

		const container = document.createElement("div")
		container.className = "post-container"
		container.appendChild(this.msgList.element)

		this.body.appendChild(container)
		this.element.appendChild(this.chatInput.element)
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

		if(this.currentRoom) matrix.off(RoomEvent.Timeline, this.onTimelineEvent(this.currentRoom));

		this.currentRoom = room

		matrix.on(RoomEvent.Timeline, this.onTimelineEvent(this.currentRoom));
	}

	getCurrentRoom() {
		return this.currentRoom
	}

}
