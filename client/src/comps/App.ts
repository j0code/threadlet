import ChannelList from "./ChannelList";
import Component from "./Component";
import View from "./View";

export default class App extends Component {

	private currentView?: View

	constructor(forums: Array<any>) {
		super("div", "app")

		const channelList = new ChannelList(forums)
		this.element.appendChild(channelList.element)
	}

	renderView(view: View, ...args: any[]) {
		if (this.currentView) {
			this.currentView.element.remove()
		}

		view.reset(...args)
		this.element.appendChild(view.element)
		this.currentView = view
	}

}
