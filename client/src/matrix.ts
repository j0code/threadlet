import { createClient } from "matrix-js-sdk";

export const matrix = createClient({
	baseUrl: localStorage.getItem("homeserver") || "https://matrix.org",
	accessToken: localStorage.getItem("accessToken") || undefined,
	userId: localStorage.getItem("userId") || undefined,
	deviceId: localStorage.getItem("deviceId") || undefined,
});

if(localStorage.getItem("accessToken") && localStorage.getItem("userId") && localStorage.getItem("deviceId")) {
	await matrix.startClient();
}
