import { MatrixEvent } from "matrix-js-sdk"
import Component from "../Component"

export default class EventBase extends Component {
	readonly message: MatrixEvent

	constructor(
		msg: MatrixEvent,
		tagName: keyof HTMLElementTagNameMap = "div",
		options: { id?: string; classes?: string[] } = {}
	) {
		super(tagName, options)
		this.message = msg
	}
}
