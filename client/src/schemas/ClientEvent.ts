import { RoomMemberContent } from "./room_events/m/room/MemberContent"
import { RoomCanonicalAliasContent } from "./room_events/m/room/CanonicalAliasContent"
import { RoomCreateContent } from "./room_events/m/room/CreateContent"
import { RoomJoinRulesContent } from "./room_events/m/room/JoinRulesContent"
import { RoomPowerLevelsContent } from "./room_events/m/room/PowerLevelsContent"
import { RoomNameContent } from "./room_events/m/room/NameContent"
import { RoomAvatarContent } from "./room_events/m/room/AvatarContent"
import { RoomPinnedEventsContent } from "./room_events/m/room/PinnedEventsContent"
import { RoomMessageContent } from "./room_events/m/room/MessageContent"
import { RoomTopicContent } from "./room_events/m/room/TopicContent"
import { RoomRedactionContent } from "./room_events/m/room/RedactionContent"
import { UnknownEvent } from "./room_events/UnknownEventContent"

/*
For potential future use:

export const UnsignedData = <EventContent extends ZodObject | ZodDiscriminatedUnion<ZodObject[]>>(content: EventContent) => z.object({
	age: z.number().int(),
	membership: MembershipUnion,
	prev_content: content,
	redacted_because: z.any(),
	transaction_id: z.string()
})

const ClientEventShape = <EventType extends string, EventContent extends ZodObject | ZodDiscriminatedUnion<ZodObject[]>>(type: EventType, content: EventContent) => ({
	content: content,
	event_id: EventId,
	origin_server_ts: z.number(),
	room_id: RoomId,
	sender: UserId,
	type: z.literal(type),
	unsigned: UnsignedData(content).optional()
} as const)

const ClientStateEventShape = <EventType extends string, EventContent extends ZodObject | ZodDiscriminatedUnion<ZodObject[]>, StateKey extends ZodString | ZodLiteral<string>>(type: EventType, content: EventContent, state_key: StateKey) => ({
	...ClientEventShape(type, content),
	state_key: state_key
} as const)

const ClientEvent = z.discriminatedUnion("type", [
	z.object(ClientStateEventShape("m.room.canonical_alias", RoomCanonicalAliasContent, z.literal(""))),
	z.object(ClientStateEventShape("m.room.create", RoomCreateContent, z.literal(""))),
	z.object(ClientStateEventShape("m.room.join_rules", RoomJoinRulesContent, z.literal(""))),
	z.object(ClientStateEventShape("m.room.member", RoomMemberContent, UserId)),
	z.object(ClientStateEventShape("m.room.power_levels", RoomPowerLevelsContent, z.literal(""))),
	z.object(ClientStateEventShape("m.room.name", RoomNameContent, z.literal(""))),
	z.object(ClientStateEventShape("m.room.topic", RoomTopicContent, z.literal(""))),
	z.object(ClientStateEventShape("m.room.avatar", RoomAvatarContent, z.literal(""))),
	z.object(ClientStateEventShape("m.room.pinned_events", RoomPinnedEventsContent, z.literal(""))),
	z.object(ClientEventShape("m.message", RoomMessageContent))
])
*/

export const UNKNOWN_EVENT_KEY: symbol = Symbol("UnknownEvent")

export type EventContent =
	| RoomCanonicalAliasContent
	| RoomCreateContent
	| RoomJoinRulesContent
	| RoomMemberContent
	| RoomPowerLevelsContent
	| RoomNameContent
	| RoomTopicContent
	| RoomAvatarContent
	| RoomPinnedEventsContent
	| RoomRedactionContent
	| RoomMessageContent
	| UnknownEvent

export type EventContentSchema =
	| typeof RoomCanonicalAliasContent
	| typeof RoomCreateContent
	| typeof RoomJoinRulesContent
	| typeof RoomMemberContent
	| typeof RoomPowerLevelsContent
	| typeof RoomNameContent
	| typeof RoomTopicContent
	| typeof RoomAvatarContent
	| typeof RoomPinnedEventsContent
	| typeof RoomRedactionContent
	| typeof RoomMessageContent
	| typeof UnknownEvent

export const EventContentMap = {
	"m.room.canonical_alias": RoomCanonicalAliasContent,
	"m.room.create": RoomCreateContent,
	"m.room.join_rules": RoomJoinRulesContent,
	"m.room.member": RoomMemberContent,
	"m.room.power_levels": RoomPowerLevelsContent,
	"m.room.name": RoomNameContent,
	"m.room.topic": RoomTopicContent,
	"m.room.avatar": RoomAvatarContent,
	"m.room.pinned_events": RoomPinnedEventsContent,
	"m.room.redaction": RoomRedactionContent,
	"m.room.message": RoomMessageContent,
	[UNKNOWN_EVENT_KEY]: UnknownEvent,
} as const satisfies Record<string | symbol, EventContentSchema>

export type SupportedEvents = keyof typeof EventContentMap & string
export type SupportedStateEvents = Exclude<SupportedEvents, "m.room.message">

export function isSupported(type: string): type is SupportedEvents {
	return type in EventContentMap
}
