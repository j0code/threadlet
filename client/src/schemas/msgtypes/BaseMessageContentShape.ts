import z from "zod"

export const BaseMessageContentShape = <MsgType extends string>(msgtype: MsgType) => ({
	body: z.string(),
	msgtype: z.literal(msgtype),
	format: z.string().optional(),
	formatted_body: z.string().optional(),
} as const)