import z from "zod"

export const URI = z.url()
export const GeoURI = z.url({ protocol: /^geo$/ })
