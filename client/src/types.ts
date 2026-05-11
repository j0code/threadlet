import { IEventRelation, IMentions, Membership, MsgType } from "matrix-js-sdk"

export type anyVoid = void | Promise<void>

export interface MXUser {
	mxid: string
	displayname: string
	avatar_url: string | null
}

export interface IContent {
	[key: string]: unknown
	body: string
	formatted_body?: string
	msgtype?: MsgType | string
	membership?: Membership
	avatar_url?: string
	displayname?: string
	"m.relates_to"?: IEventRelation

	"m.mentions"?: IMentions
}
