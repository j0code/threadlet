import ChannelList from "./ChannelList"
import Component from "./Component"
import Form from "./Form"
import View from "./View"

export default class App extends Component {

	readonly channelList: ChannelList
	private currentView?: View | Form

	constructor(forums: Array<any>) {
		super("div", { id: "app" })

		this.channelList = new ChannelList(forums)
		this.element.appendChild(this.channelList.element)
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
