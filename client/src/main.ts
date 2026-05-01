import "../style.css"
import "../md.css"
import "highlight.js/styles/github-dark.min.css"
import App from "./comps/App"
import ForumSettingsForm from "./comps/ForumSettingsForm"
import ThreadletAPI from "@j0code/threadlet-api/v0"
import PostSettingsForm from "./comps/PostSettingsForm"
import ForumView from "./comps/ForumView"
import PostView from "./comps/PostView"
import { User } from "matrix-js-sdk"
import Login from "./comps/Login"
import RoomView from "./comps/RoomView"

export let api: ThreadletAPI
export let app: App | Login
export let clientUser: User

export const views = {
	forumCreateForm: new ForumSettingsForm(),
	postCreateForm: new PostSettingsForm(),
	forumView: new ForumView(),
	postView: new PostView(),
	roomView: new RoomView(),
} as const

document.getElementById("loadingScreen")!.remove();
app = localStorage.getItem("accessToken") ? new App() : new Login()
document.body.appendChild(app.element)

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

// 	api.on("forumCreate", async forum => {
// 		// TODO: update and read cache instead of fetching
// 		const forums = await api.getForums()
// 		app.channelList.reset(forums)
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
