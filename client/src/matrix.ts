import { createClient } from "matrix-js-sdk";

async function getActualServerUrl(server: string) {
	const res = await fetch(server + "/.well-known/matrix/client").then(res => res.json()).catch(() => null);
	if(res && res["m.homeserver"] && res["m.homeserver"].base_url) {
		return res["m.homeserver"].base_url;
	}
	return server;
}

export const matrix = createClient({
	baseUrl: await getActualServerUrl(localStorage.getItem("homeserver") || "https://matrix.org"),
	accessToken: localStorage.getItem("accessToken") || undefined,
	userId: localStorage.getItem("userId") || undefined,
	deviceId: localStorage.getItem("deviceId") || undefined,
});

export async function initMatrixClient() {
	if(!(localStorage.getItem("accessToken") && localStorage.getItem("userId") && localStorage.getItem("deviceId"))) {
		return;
	}
	await matrix.startClient();
}
