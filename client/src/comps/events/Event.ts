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

const eventTypes = {
	"m.room.message": RoomTextMessage,
	"m.room.name": RoomNameEvent,
} satisfies Record<string, typeof EventBase>

const msgTypes = {
	"m.text": RoomTextMessage,
	"m.image": RoomImageMessage,
	"m.emote": RoomEmoteMessage,
	"m.notice": RoomNoticeMessage,
	"m.audio": RoomAudioMessage,
	"m.video": RoomVideoMessage,
	"m.file": RoomFileMessage,
} satisfies Record<string, typeof EventBase>

type EventClasses =
	| (typeof eventTypes)[keyof typeof eventTypes]
	| (typeof msgTypes)[keyof typeof msgTypes]
	| typeof UnknownEvent

export function renderEvent(event: MatrixEvent) {
	const type = event.getType()

	let EventClass: EventClasses =
		type in eventTypes
			? eventTypes[type as keyof typeof eventTypes]
			: UnknownEvent
	if (type === "m.room.message" && event.getContent().msgtype) {
		const msgtype = event.getContent().msgtype!
		EventClass =
			msgtype in msgTypes
				? msgTypes[msgtype as keyof typeof msgTypes]
				: RoomTextMessage
	}

	return new EventClass(event)
}
