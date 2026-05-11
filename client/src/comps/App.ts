import { ClientEvent, RoomEvent } from "matrix-js-sdk"
import { initMatrixClient, matrix } from "../matrix"
import RoomList from "./RoomList"
import Component from "./Component"
import Form from "./Form"
import View from "./View"

export default class App extends Component {
	readonly roomList: RoomList
	private currentView?: View | Form

	constructor() {
		super("div", { id: "app" })

		this.roomList = new RoomList([])
		this.element.appendChild(this.roomList.element)

		matrix.once(ClientEvent.Sync, () => {
			this.updateChannelList()
		})

		matrix.on(RoomEvent.MyMembership, () => {
			this.updateChannelList()
		})

		void initMatrixClient()
	}

	updateChannelList() {
		const rooms = matrix.getRooms()
		this.roomList.reset(rooms)
	}

	renderView(view: View | Form | undefined, ...args: unknown[]) {
		if (this.currentView) {
			this.currentView.element.remove()
		}
		if (!view) return

		void view.reset(...args)
		this.element.appendChild(view.element)
		this.currentView = view
	}

	getCurrentView() {
		return this.currentView
	}
}
