import { IEventRelation, IMentions, Membership, MsgType } from "matrix-js-sdk"

export type MaybePromise<T> = T | Promise<T>

export interface MXUser {
	mxid: string
	displayname: string
	avatar_url: string | null
}

export interface IContent {
	[key: string]: unknown
	formatted_body?: string
	msgtype?: MsgType | string
	membership?: Membership
	avatar_url?: string
	displayname?: string | null
	"m.relates_to"?: IEventRelation

	"m.mentions"?: IMentions
}
