import { matrix } from "../matrix";
import Component from "./Component";

export default class MXCImage extends Component {
	constructor(mxc: string) {
		super("img", { classes: ["mxc-image"] })
		this.element.setAttribute("data-mxc", mxc)		
	}

	async reset() {
		const mxc = this.element.getAttribute("data-mxc")
		if(mxc) {
			const url = await this.getMXCImage(mxc)
			if(url) {
				this.element.setAttribute("src", url)
			}
		}
	}

	async getMXCImage(mxc: string) {
		console.log("Getting avatar url for", mxc)
		// TODO: caching
		const url = matrix.mxcUrlToHttp(mxc, undefined, undefined, undefined, false, true, true)
		if(!url) {
			return null
		}
		const img = await fetch(url, {
			headers: {
				Authorization: `Bearer ${matrix.getAccessToken()}`
			}
		})
		const blob = await img.blob()
		return URL.createObjectURL(blob)
	}

}