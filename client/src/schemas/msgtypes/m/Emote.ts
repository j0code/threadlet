import z from "zod"
import { BaseMessageContentShape } from "../BaseMessageContentShape"

export const Emote = z.object(BaseMessageContentShape("m.emote"))
export type Emote = z.infer<typeof Emote>