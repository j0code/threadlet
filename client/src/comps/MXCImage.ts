import { getMXCData, matrix } from "../matrix";
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
			const url = await getMXCData(mxc, this.options.width, this.options.height, this.options.resizeMethod)
			if(url) {
				this.element.setAttribute("src", url)
			}
		}
	}

}