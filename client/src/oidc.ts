// OIDC Server needs to have redirect url for /login/callback

import ThreadletAPI from "@j0code/threadlet-api";

export async function getAuthURL(api: ThreadletAPI) {
	const server_config = await fetch(`${api.API_ROOT}/auth`).then(res => res.json());
	if(server_config.type != "oidc") {
		throw new Error("Server is not configured for OIDC");
	}
	const pkce = await generatePKCEChallenge();
	const state = generateRandomString(16);
	return {
		url: `${server_config.auth_url}?client_id=${server_config.client_id}&response_type=code&redirect_uri=${window.location.origin}/auth_callback&scope=openid%20profile&code_challenge=${pkce.codeChallenge}&code_challenge_method=S256&state=${state}`,
		codeVerifier: pkce.codeVerifier,
		state
	};
}

// Function to generate PKCE code challenge
// With the S256 method
async function generatePKCEChallenge() {
	const codeVerifier = generateRandomString(128);
	const codeChallengeBuf = await sha256(codeVerifier);
	const codeChallenge = base64URLEncode(new Uint8Array(codeChallengeBuf));
	return { codeVerifier, codeChallenge };
}

// Generates a cryptographically secure random string
function generateRandomString(length: number) {
	const array = new Uint32Array(length / 2);
	window.crypto.getRandomValues(array);
	return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

// Encodes a string to base64url (no padding)
function base64URLEncode(buffer: Uint8Array) {
	return btoa(String.fromCharCode(...buffer))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
}

async function sha256(input: string | undefined) {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	return await window.crypto.subtle.digest("SHA-256", data);
}