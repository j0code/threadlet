import { DiscordSDK } from "@discord/embedded-app-sdk"
import { REST } from '@discordjs/rest'
import "../style.css"
import "../md.css"
import "highlight.js/styles/github-dark.min.css"
import App from "./comps/App"
import ForumCreateForm from "./comps/ForumCreateForm"
import ThreadletAPI from "./api/api"
import { Routes } from "discord-api-types/v10"
import PostCreateForm from "./comps/PostCreateForm"
import ForumView from "./comps/ForumView"
import PostView from "./comps/PostView"

// Will eventually store the authenticated user's access_token
let auth: Awaited<ReturnType<typeof discordSdk.commands.authenticate>>
let rest: REST

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID)
export let api: ThreadletAPI
export let app: App

export const views = {
	forumCreateForm: new ForumCreateForm(),
	postCreateForm:  new PostCreateForm(),
	forumView: new ForumView(),
	postView: new PostView(),
} as const

setupDiscordSdk().then(async () => {
	console.log("Discord SDK is authenticated")
	
	document.getElementById("loadingScreen")!.remove()
	document.body.appendChild(app.element)

	// ------------------------------------------------------------

	// We can now make API calls within the scopes we requested in setupDiscordSDK()
	// Note: the access_token returned is a sensitive secret and should be treated as such
	let guildName = "Unknown" // likely DM if Unknown

	if (discordSdk.guildId != null) {
		try {
			const guilds = await rest.get(Routes.userGuilds())

			if (guilds && guilds instanceof Array) {
				const guild = guilds.find(g => g.id == discordSdk.guildId)
				if (guild && typeof guild == "object" && "name" in guild) {
					guildName = guild.name as string
				}
			}
		} catch (ignore) {}
	}

	/*const textTagString = `User: ${auth.user.global_name}<br>Guild: ${guildName}`
	const textTag = document.createElement('p')
	textTag.innerHTML = textTagString
	app.appendChild(textTag)*/
})
	
async function setupDiscordSdk() {
	await discordSdk.ready()
	console.log("Discord SDK is ready")
		
	// Authorize with Discord Client
	const { code } = await discordSdk.commands.authorize({
		client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
		response_type: "code",
		state: "",
		prompt: "none",
		scope: [
			"identify",
			"guilds",
			"applications.commands"
		]
	})
	
	// Retrieve an access_token from your activity's server
	// Note: We need to prefix our backend `/api/token` route with `/.proxy` to stay compliant with the CSP.
	// Read more about constructing a full URL and using external resources at
	// https://discord.com/developers/docs/activities/development-guides#construct-a-full-url
	const response = await fetch("/.proxy/api/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
			body: JSON.stringify({
			code,
		})
	})
	const { access_token } = await response.json()
	
	// Authenticate with Discord client (using the access_token)
	auth = await discordSdk.commands.authenticate({
		access_token,
	})
	
	if (auth == null) {
		throw new Error("Authenticate command failed")
	}

	rest = new REST({ version: '10', authPrefix: "Bearer" }).setToken(auth.access_token)
	api  = new ThreadletAPI(access_token)

	const forums = await api.getForums()
	app = new App(forums)
}
