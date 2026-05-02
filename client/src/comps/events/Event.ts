import { MatrixEvent } from "matrix-js-sdk";
import Component from "../Component";
import RoomTextMessage from "./RoomTextMessage";
import ChatMessageBase from "./ChatMessageBase";
import RoomImageMessage from "./RoomImageMessage";
import RoomEmoteMessage from "./RoomEmoteMessage";
import EventMessageBase from "./EventMessageBase";
import EventBase from "./EventBase";
import RoomNoticeMessage from "./RoomNoticeMessage";
import RoomVideoMessage from "./RoomVideoMessage";
import RoomAudioMessage from "./RoomAudioMessage";
import RoomFileMessage from "./RoomFileMessage";

const eventTypes: Record<string, typeof EventBase> = {
	"m.room.message": RoomTextMessage,
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
	let EventClass = eventTypes[event.getType()] || ChatMessageBase
	if(event.getType() === "m.room.message" && event.getContent().msgtype) {
		const msgtype = event.getContent().msgtype!
		EventClass = msgTypes[msgtype] || RoomTextMessage
	}
	return new EventClass(event)
}
