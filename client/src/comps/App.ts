import { ClientEvent, RoomEvent } from "matrix-js-sdk"
import { matrix } from "../matrix"
import ChannelList from "./ChannelList"
import Component from "./Component"
import Form from "./Form"
import View from "./View"

export default class App extends Component {
	readonly channelList: ChannelList
	private currentView?: View | Form

	constructor() {
		super("div", { id: "app" })

		this.channelList = new ChannelList([])
		this.element.appendChild(this.channelList.element)

		matrix.once(ClientEvent.Sync, () => {
			this.updateChannelList();
		})

		matrix.on(RoomEvent.MyMembership, () => {
			this.updateChannelList();
		})
	}

	updateChannelList() {
		let rooms = matrix.getRooms()
		this.channelList.reset(rooms)
	}

	renderView(view: View | Form, ...args: unknown[]) {
		if (this.currentView) {
			this.currentView.element.remove()
		}

		void view.reset(...args)
		this.element.appendChild(view.element)
		this.currentView = view
	}

	getCurrentView() {
		return this.currentView
	}
}
