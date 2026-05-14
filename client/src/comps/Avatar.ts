import { getMXUser } from "../matrix"
import Component from "./Component"
import MXCImage from "./MXCImage"

export default class Avatar extends Component {
	public readonly mxid: string

	constructor(mxid: string, className?: string) {
		super("div", { classes: className ? ["avatar", className] : ["avatar"] })
		this.mxid = mxid
		this.element.setAttribute("data-mxid", mxid)
		void this.reset()
	}

	async reset() {
		const mxid = this.element.getAttribute("data-mxid")
		if (!mxid) return

		this.element.innerHTML = ""

		const { displayname, avatar_url } = await getMXUser(mxid)

		if (avatar_url) {
			const img = new MXCImage(avatar_url, {
				width: 64,
				height: 64,
				resizeMethod: "scale",
			})
			await img.reset()
			this.element.appendChild(img.element)
		} else {
			this.element.style.backgroundColor = this.stringToColor(mxid)
			this.element.style.color = this.contrastingColor(this.stringToColor(mxid))
			this.element.textContent = displayname[0]?.toUpperCase() || "?"
		}
	}

	private stringToColor(str: string) {
		let hash = 0
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash)
		}
		const color = (hash & 0x00ffffff).toString(16).toUpperCase()
		return `#${color.padStart(6, "0")}`
	}

	private contrastingColor(hex: string): "#000000" | "#FFFFFF" {
		const r = parseInt(hex.substring(1, 3), 16)
		const g = parseInt(hex.substring(3, 5), 16)
		const b = parseInt(hex.substring(5, 7), 16)
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
		return luminance > 0.5 ? "#000000" : "#FFFFFF"
	}
}
