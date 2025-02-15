import ChannelList from "./ChannelList";
import Component from "./Component";

export default class App extends Component {

	private currentView?: Component

	constructor(forums: Array<any>) {
		super("div", "app")

		const channelList = new ChannelList(forums)
		this.element.appendChild(channelList.element)
	}

	renderView(view: Component) {
		if (this.currentView) {
			this.currentView.element.remove()
		}

		this.element.appendChild(view.element)
		this.currentView = view
	}

}
