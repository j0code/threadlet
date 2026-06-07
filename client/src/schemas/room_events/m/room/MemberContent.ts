import z from "zod"
import { UserId } from "../../../ids"
import { URI } from "../../../uris"

const SignedThirdPartyInvite = z.object({
	mxid: UserId,
	signatures: z.record(z.string(), z.record(z.string(), z.string())),
	token: z.string()
})
export type SignedThirdPartyInvite = z.infer<typeof SignedThirdPartyInvite>

const ThirdPartyInvite = z.object({
	display_name: z.string(),
	signed: SignedThirdPartyInvite
})
export type ThirdPartyInvite = z.infer<typeof ThirdPartyInvite>

export const MembershipUnion = z.union([
	z.literal("invite"),
	z.literal("join"),
	z.literal("knock"),
	z.literal("leave"),
	z.literal("ban")
])
export type MembershipUnion = z.infer<typeof MembershipUnion>

export const RoomMemberContent = z.object({
	avatar_url: URI,
	displayname: z.string().or(z.null()).default(null),
	is_direct: z.boolean().optional(),
	join_authorised_via_users_server: z.string().optional(),
	membership: MembershipUnion,
	reason: z.string().optional(),
	third_party_invite: ThirdPartyInvite.optional()
})
export type RoomMemberContent = z.infer<typeof RoomMemberContent>