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

	renderView(view: View | Form, ...args: unknown[]) {
		this.clearView()

		void view.reset(...args)
		this.element.appendChild(view.element)
		this.currentView = view
	}

	clearView() {
		if (this.currentView) {
			this.currentView.element.remove()
			this.currentView = undefined
		}
	}

	getCurrentView() {
		return this.currentView
	}
}
