import { createClient } from "matrix-js-sdk"
import { MXUser } from "./types"

async function getActualServerUrl(server: string) {
	const res = await fetch(server + "/.well-known/matrix/client")
		.then(res => res.json() as unknown)
		.catch(() => null)

	if (!res || typeof res != "object") return server
	if (
		!("m.homeserver" in res) ||
		typeof res["m.homeserver"] != "object" ||
		!res["m.homeserver"]
	)
		return server
	if (
		!("base_url" in res["m.homeserver"]) ||
		typeof res["m.homeserver"].base_url != "string"
	)
		return server

	return res["m.homeserver"].base_url
}

export const matrix = createClient({
	baseUrl: await getActualServerUrl(
		localStorage.getItem("homeserver") || "https://matrix.org"
	),
	accessToken: localStorage.getItem("accessToken") || undefined,
	userId: localStorage.getItem("userId") || undefined,
	deviceId: localStorage.getItem("deviceId") || undefined,
})

export async function initMatrixClient() {
	if (
		!(
			localStorage.getItem("accessToken") &&
			localStorage.getItem("userId") &&
			localStorage.getItem("deviceId")
		)
	) {
		console.error("No access token, user ID, or device ID found in localStorage. Not starting Matrix client.")
		return
	}
	await matrix.startClient()
}

export async function getMXCData(
	mxc: string,
	width?: number,
	height?: number,
	resizeMethod?: "crop" | "scale",
	allowDirectLink = false,
	allowRedirects = true
) {
	const url = matrix.mxcUrlToHttp(
		mxc,
		width,
		height,
		resizeMethod,
		allowDirectLink,
		allowRedirects,
		true
	)
	if (!url) {
		return null
	}
	const res = await fetch(url, {
		headers: {
			Authorization: "Bearer " + matrix.getAccessToken(),
		},
	})
		.then(res => res.blob())
		.catch(() => null)
	if (!res) {
		return null
	}
	return URL.createObjectURL(res)
}

export async function getMXUser(mxid: string): Promise<MXUser> {
	const user = matrix.getUser(mxid)
	let displayname: string
	let avatar_url: string | null

	if (user) {
		displayname = user?.displayName || mxid
		avatar_url = user?.avatarUrl ?? null
	} else {
		const profile = await matrix.getProfileInfo(mxid)
		displayname = profile?.displayname || mxid
		avatar_url = profile?.avatar_url ?? null
	}

	return { mxid, displayname, avatar_url }
}
