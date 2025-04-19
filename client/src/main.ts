import { DiscordSDK } from "@discord/embedded-app-sdk"
import { REST } from '@discordjs/rest'
import "../style.css"
import "../md.css"
import "highlight.js/styles/github-dark.min.css"
import App from "./comps/App"
import ForumSettingsForm from "./comps/ForumSettingsForm"
import ThreadletAPI from "@j0code/threadlet-api/v0"
import { APIUser, Routes } from "discord-api-types/v10"
import PostSettingsForm from "./comps/PostSettingsForm"
import ForumView from "./comps/ForumView"
import PostView from "./comps/PostView"
import { getAuthURL } from "./oidc"

// Will eventually store the authenticated user's access_token
// let auth: Awaited<ReturnType<typeof discordSdk.commands.authenticate>>
// let rest: REST

// const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID)
export let api: ThreadletAPI
export let app: App
export let clientUser: APIUser

export const views = {
	forumCreateForm: new ForumSettingsForm(),
	postCreateForm:  new PostSettingsForm(),
	forumView: new ForumView(),
	postView: new PostView(),
} as const

// setupDiscordSdk().then(async () => {
// 	console.log("Discord SDK is authenticated")
	
// 	document.getElementById("loadingScreen")!.remove()
// 	document.body.appendChild(app.element)

// 	// ------------------------------------------------------------

// 	// We can now make API calls within the scopes we requested in setupDiscordSDK()
// 	// Note: the access_token returned is a sensitive secret and should be treated as such
// 	let guildName = "Unknown" // likely DM if Unknown

// 	if (discordSdk.guildId != null) {
// 		try {
// 			const guilds = await rest.get(Routes.userGuilds())

// 			if (guilds && guilds instanceof Array) {
// 				const guild = guilds.find(g => g.id == discordSdk.guildId)
// 				if (guild && typeof guild == "object" && "name" in guild) {
// 					guildName = guild.name as string
// 				}
// 			}
// 		} catch (ignore) {}
// 	}

// 	clientUser = await rest.get(Routes.user()) as APIUser


// 	api.on("messageCreate", msg => {
// 		const view = app.getCurrentView()
// 		if (!(view instanceof PostView)) return
// 		if (view.getCurrentPostId() != msg.post_id) return
// 		view.msgList.pushMessage(msg)
// 	})
// })
	
// async function setupDiscordSdk() {
// 	await discordSdk.ready()
// 	console.log("Discord SDK is ready")
		
// 	// Authorize with Discord Client
// 	const { code } = await discordSdk.commands.authorize({
// 		client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
// 		response_type: "code",
// 		state: "",
// 		prompt: "none",
// 		scope: [
// 			"identify",
// 			"guilds",
// 			"applications.commands"
// 		]
// 	})
	
// 	// Retrieve an access_token from your activity's server
// 	// Note: We need to prefix our backend `/api/token` route with `/.proxy` to stay compliant with the CSP.
// 	// Read more about constructing a full URL and using external resources at
// 	// https://discord.com/developers/docs/activities/development-guides#construct-a-full-url
// 	const response = await fetch(`/.proxy/api/v0/token`, {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json"
// 		},
// 			body: JSON.stringify({
// 			code,
// 		})
// 	})
// 	const { access_token } = await response.json()
	
// 	// Authenticate with Discord client (using the access_token)
// 	auth = await discordSdk.commands.authenticate({
// 		access_token,
// 	})
	
// 	if (auth == null) {
// 		throw new Error("Authenticate command failed")
// 	}

// 	rest = new REST({ version: '10', authPrefix: "Bearer" }).setToken(auth.access_token)
// 	api  = new ThreadletAPI(access_token)

// 	const forums = await api.getForums()
// 	app = new App(forums)
// }

setupOIDC()

async function setupOIDC() {
	api  = new ThreadletAPI("", {
		API_ROOT: "/api/v0",
		GATEWAY:  "/api/v0/gateway",
	})

	if(location.pathname == "/auth_callback") {
		console.log("OIDC login callback")
		const state = localStorage.getItem("oidc_state");
		const codeVerifier = localStorage.getItem("codeVerifier");
		localStorage.removeItem("oidc_state");
		localStorage.removeItem("codeVerifier");
		if(!state || !codeVerifier) {
			alert("OIDC login failed: state or codeVerifier missing");
			location.href = "/";
			return;
		}
		// const urlstate = $page.url.searchParams.get("state");
		const searchParams = new URLSearchParams(location.search);
		const code = searchParams.get("code");
		const urlstate = searchParams.get("state");
		if(urlstate !== state) {
			alert("OIDC login failed: state mismatch");
			location.href = "/";
			return;
		}
		if(!code) {
			alert("OIDC login failed: code missing");
			location.href = "/";
			return;
		}

		const result = await fetch(`${api.API_ROOT}/auth/oidc`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				code, codeVerifier
			})
		}).then(res => res.json());
		console.log(result);
		if(result.error) { // TODO
			alert(result.error);
			location.href = "/";
		} else {
			localStorage.setItem("session", result.access_token);
			history.replaceState({}, "", "/");
		}
	}
	const session = localStorage.getItem("session");
	if(session == null) {
		return await initiateOIDCLogin()
	}

	api  = new ThreadletAPI(session, {
		API_ROOT: "/api/v0",
		GATEWAY:  "/api/v0/gateway",
	})

	let forums;
	try {
		forums = await api.getForums()
	} catch(e) {
		localStorage.removeItem("session");
		await initiateOIDCLogin()
		return;
	}
	app = new App(forums)
	document.getElementById("loadingScreen")!.remove()
	document.body.appendChild(app.element)
}

async function initiateOIDCLogin() {
	document.querySelector<HTMLSpanElement>("#loadingText")!.innerText = "Authenticating...";
	const auth = await getAuthURL(api)
	localStorage.setItem("codeVerifier", auth.codeVerifier)
	localStorage.setItem("oidc_state", auth.state)
	location.href = auth.url
	return
}
