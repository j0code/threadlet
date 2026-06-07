import z from "zod"
import { BaseMessageContentShape } from "../BaseMessageContentShape"

export const Text = z.object(BaseMessageContentShape("m.text"))
export type Text = z.infer<typeof Text>
