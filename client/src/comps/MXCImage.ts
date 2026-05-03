import { matrix } from "../matrix";
import Component from "./Component";

interface MXCImageOptions {
	width?: number
	height?: number
	resizeMethod?: "crop" | "scale"
}

export default class MXCImage extends Component {

	public readonly options: MXCImageOptions

	constructor(mxc: string, opts?: MXCImageOptions) {
		super("img", { classes: ["mxc-image"] })
		this.element.setAttribute("data-mxc", mxc)		
		this.options = opts || {}
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
		const url = matrix.mxcUrlToHttp(mxc, this.options.width, this.options.height, this.options.resizeMethod, false, true, true)
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