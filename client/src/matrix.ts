import { createClient } from "matrix-js-sdk"

async function getActualServerUrl(server: string) {
	const res = await fetch(server + "/.well-known/matrix/client")
		.then(res => res.json())
		.catch(() => null)
	if (res && res["m.homeserver"] && res["m.homeserver"].base_url) {
		return res["m.homeserver"].base_url
	}
	return server
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

export async function getMXUser(mxid: string) {
	const user = matrix.getUser(mxid)
	let displayname: string
	let avatar_url: string | undefined = undefined

	if (user) {
		displayname = user?.displayName || mxid
		avatar_url = user?.avatarUrl
	} else {
		const profile = await matrix.getProfileInfo(mxid)
		displayname = profile?.displayname || mxid
		avatar_url = profile?.avatar_url
	}
	return { displayname, avatar_url }
}
