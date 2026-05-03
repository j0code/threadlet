import { matrix } from "../matrix";
import Component from "./Component";
import MXCImage from "./MXCImage";

export default class Avatar extends Component {
	public readonly mxid: string

	constructor(mxid: string, className?: string) {
		super("div", { classes: className ? ["avatar", className] : ["avatar"]})
		this.mxid = mxid
		this.element.setAttribute("data-mxid", mxid)
		this.reset()
	}

	async reset() {
		const mxid = this.element.getAttribute("data-mxid")
		if(!mxid) return

		this.element.innerHTML = ""

		const user = matrix.getUser(mxid)
		let displayname = user?.displayName
		let avatar_url = user?.avatarUrl
		if(!user) {
			const profile = await matrix.getProfileInfo(mxid)
			displayname = profile?.displayname || mxid
			avatar_url = profile?.avatar_url
		}
		if(avatar_url) {
			let img = new MXCImage(avatar_url, {
				width: 64,
				height: 64,
				resizeMethod: "scale"
			})
			await img.reset()
			this.element.appendChild(img.element)
		} else {
			this.element.style.backgroundColor = this.stringToColor(mxid)
			this.element.style.color = this.contrastingColor(this.stringToColor(mxid))
			this.element.style.fontSize = "24px"
			this.element.style.display = "flex"
			this.element.style.alignItems = "center"
			this.element.style.justifyContent = "center"
			this.element.textContent = displayname?.[0]?.toUpperCase() || "?"
		}
	}

	private stringToColor(str: string) {
		let hash = 0
		for(let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash)
		}
		const color = (hash & 0x00FFFFFF).toString(16).toUpperCase()
		return `#${color.padStart(6, "0")}`
	}

	private contrastingColor(hex: string): "#000000" | "#FFFFFF" {
		const r = parseInt(hex.substr(1, 2), 16)
		const g = parseInt(hex.substr(3, 2), 16)
		const b = parseInt(hex.substr(5, 2), 16)
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
		return luminance > 0.5 ? "#000000" : "#FFFFFF"
	}
}