import z from "zod"

//////// SERVER NAME ////////
// Grammar according to spec:
// https://spec.matrix.org/latest/appendices/#server-name
/////////////////////////////

// port = 1*5DIGIT
const portPattern = "\\d{1,5}"

// IPv4address = 1*3DIGIT "." 1*3DIGIT "." 1*3DIGIT "." 1*3DIGIT
const ipv4Pattern = "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}"

// IPv6char = DIGIT / A-F / a-f / ":" / "."
const ipv6CharPattern = "[0-9A-Fa-f:.]"

// IPv6address = 2*45IPv6char
const ipv6Pattern = `${ipv6CharPattern}{2,45}`

// dns-char = DIGIT / ALPHA / "-" / "."
const dnsCharPattern = "[0-9A-Za-z-.]"

// dns-name = 1*255dns-char
const dnsNamePattern = `${dnsCharPattern}{1,255}`

// hostname = IPv4address / "[" IPv6address "]" / dns-name
const hostnamePattern = `(?:${ipv4Pattern}|\\[${ipv6Pattern}\\]|${dnsNamePattern})`

// server_name = hostname [ ":" port ]
const serverNamePattern = `${hostnamePattern}(?::${portPattern})?`

export const ServerName = z
	.string()
	.regex(
		new RegExp(`^${serverNamePattern}$`),
		"Invalid Server Name format. Expected: hostname or hostname:port"
	)

//////// USER IDENTIFIERS ////////
// Grammar according to spec:
// https://spec.matrix.org/latest/appendices/#user-identifiers
// Currently unused
//////////////////////////////////

// DIGIT / %x61-7A / "-" / "." / "=" / "_" / "/" / "+"
const localpartCharPattern = "[0-9a-z-.=_/+]"

// 1*user_id_char
const localpartPattern = `${localpartCharPattern}+`

// "@" user_id_localpart ":" server_name
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userIdentifierPattern = `@${localpartPattern}:${serverNamePattern}`

//////// HISTORICAL USER IDENTIFIERS ////////
// Grammar according to spec:
// https://spec.matrix.org/latest/appendices/#historical-user-ids
/////////////////////////////////////////////

// Any Unicode character except :, NUL, and surrogates
const historialLocalpartCharPattern = "(?![:\\x00]|\\p{Surrogate})[\\s\\S]"

// 1*user_id_char
const historialLocalpartPattern = `${historialLocalpartCharPattern}+`

// "@" user_id_localpart ":" server_name
const historialUserIdentifierPattern = `@${historialLocalpartPattern}:${serverNamePattern}`

export const UserId = z
	.string()
	.regex(
		new RegExp(`^${historialUserIdentifierPattern}$`),
		"Invalid User ID format. Expected: @localpart:server_name"
	)
	.max(255)

//////// ROOM IDENTIFIERS ////////
// Grammar according to spec:
// https://spec.matrix.org/latest/appendices/#room-ids
//////////////////////////////////

export const RoomId = z
	.string()
	.regex(/^!.*$/, 'Room IDs must start with "$"')
	.max(255)

//////// ROOM ALIASES ////////
// Grammar according to spec:
// https://spec.matrix.org/latest/appendices/#room-ids
//////////////////////////////

// Any Unicode character except :, NUL, and surrogates
const roomAliasLocalpartCharPattern = "(?![:\\x00]|\\p{Surrogate})[\\s\\S]"

// 1*room_alias_char
const roomAliasLocalpartPattern = `${roomAliasLocalpartCharPattern}+`

// "#" room_alias_localpart ":" server_name
const roomAliasPattern = `@${roomAliasLocalpartPattern}:${serverNamePattern}`

export const RoomAlias = z
	.string()
	.regex(
		new RegExp(`^${roomAliasPattern}$`),
		"Invalid Room Alias format. Expected: #localpart:server_name"
	)
	.max(255)

//////// EVENT IDENTIFIERS ////////
// Grammar according to spec:
// https://spec.matrix.org/latest/appendices/#event-ids
//////////////////////////////////

export const EventId = z
	.string()
	.regex(/^\$.*$/, 'Event IDs must start with "$"')
	.max(255)
