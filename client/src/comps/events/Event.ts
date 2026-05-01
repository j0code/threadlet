import { MatrixEvent } from "matrix-js-sdk";
import Component from "../Component";
import RoomMessage from "./RoomMessage";
import ChatMessageBase from "./ChatMessageBase";

const eventTypes: Record<string, typeof ChatMessageBase> = {
	"m.room.message": RoomMessage,
}

export function renderEvent(event: MatrixEvent) {
	const EventClass = eventTypes[event.getType()] || ChatMessageBase
	return new EventClass(event)
}
