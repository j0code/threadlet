import { CDN as DiscordCDN } from "@discordjs/rest"

const cdn = new DiscordCDN()

/**
 * Interface to interact with the Discord and Threadlet CDN
 * @module
 */
export default class CDN {

	static avatar(userId: string, avatarHash: string | null): string {
		if (!avatarHash) {
			const index = Number(BigInt(userId) >> 22n) % 6

			return cdn.defaultAvatar(index) // TODO: error handling
		}

		return cdn.avatar(userId, avatarHash)
	}

}
