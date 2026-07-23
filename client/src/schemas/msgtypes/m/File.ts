import z from "zod"
import { BaseFileInfo } from "../../BaseFileInfo"
import { URI } from "../../uris"
import { BaseMessageContentShape } from "../BaseMessageContentShape"

const FileInfo = BaseFileInfo.and(
	z.object({
		thumbnail_file: z.record(z.string(), z.unknown()).optional(),
	})
)
export type FileInfo = z.infer<typeof FileInfo>

export const File = z.object({
	...BaseMessageContentShape("m.file"),
	file: z.record(z.string(), z.unknown()).optional(),
	filename: z.string().optional(),
	info: FileInfo,
	url: URI,
})
export type File = z.infer<typeof File>
