import z from "zod"
import { BaseMessageContentShape } from "../BaseMessageContentShape"

export const Notice = z.object(BaseMessageContentShape("m.notice"))
export type Notice = z.infer<typeof Notice>
