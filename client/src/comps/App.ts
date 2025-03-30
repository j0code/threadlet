import ChannelList from "./ChannelList"
import Component from "./Component"
import EmojiPicker from "./EmojiPicker"
import Form from "./Form"
import View from "./View"

export default class App extends Component {

	private currentView?: View | Form

	constructor(forums: Array<any>) {
		super("div", { id: "app" })

		const channelList = new ChannelList(forums)
		this.element.appendChild(channelList.element)
	}

	renderView(view: View | Form, ...args: any[]) {
		if (this.currentView) {
			this.currentView.element.remove()
		}

		view.reset(...args)
		this.element.appendChild(view.element)
		this.currentView = view
	}

	getCurrentView() {
		return this.currentView
	}

}
