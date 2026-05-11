import { MatrixEvent } from "matrix-js-sdk"
import RoomTextMessage from "./RoomTextMessage"
import RoomImageMessage from "./RoomImageMessage"
import RoomEmoteMessage from "./RoomEmoteMessage"
import EventBase from "./EventBase"
import RoomNoticeMessage from "./RoomNoticeMessage"
import RoomVideoMessage from "./RoomVideoMessage"
import RoomAudioMessage from "./RoomAudioMessage"
import RoomFileMessage from "./RoomFileMessage"
import UnknownEvent from "./UnknownEvent"
import RoomNameEvent from "./RoomNameEvent"

const eventTypes: Record<string, typeof EventBase> = {
	"m.room.message": RoomTextMessage,
	"m.room.name": RoomNameEvent,
}

const msgTypes: Record<string, typeof EventBase> = {
	"m.text": RoomTextMessage,
	"m.image": RoomImageMessage,
	"m.emote": RoomEmoteMessage,
	"m.notice": RoomNoticeMessage,
	"m.audio": RoomAudioMessage,
	"m.video": RoomVideoMessage,
	"m.file": RoomFileMessage,
}

export function renderEvent(event: MatrixEvent) {
	let EventClass = eventTypes[event.getType()] || UnknownEvent
	if (event.getType() === "m.room.message" && event.getContent().msgtype) {
		const msgtype = event.getContent().msgtype!
		EventClass = msgTypes[msgtype] || RoomTextMessage
	}
	return new EventClass(event)
}
