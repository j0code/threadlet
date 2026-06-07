import z from "zod"
import { ThumbnailInfo } from "../../ThumbnailInfo"
import { GeoURI, URI } from "../../uris"
import { BaseMessageContentShape } from "../BaseMessageContentShape"

const LocationInfo = z.object({
	thumbnail_file: z.record(z.string(), z.unknown()).optional(),
	thumbnail_info: ThumbnailInfo.optional(),
	thumbnail_url: URI.optional()
})
export type LocationInfo = z.infer<typeof LocationInfo>

export const Location = z.object({
	...BaseMessageContentShape("m.location"),
	geo_uri: GeoURI,
	info: LocationInfo
})
export type Location = z.infer<typeof Location>