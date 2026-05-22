import { ClientEvent, RoomEvent } from "matrix-js-sdk"
import { initMatrixClient, matrix } from "../matrix"
import RoomList from "./RoomList"
import Component from "./Component"
import Form from "./forms/Form"
import View from "./views/View"
import Modal from "./Modal"

export default class App extends Component {
	readonly roomList: RoomList
	private currentView?: View | Form
	private modals: Modal[]

	constructor() {
		super("div", { id: "app" })

		this.roomList = new RoomList([])
		this.element.appendChild(this.roomList.element)
		this.modals = []

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

	openModal(modal: Modal) {
		if (this.modals.length > 0) {
			const element = this.getCurrentModal()!.element as HTMLDialogElement
			element.close()
		}

		this.modals.push(modal)
		const element = modal.element as HTMLDialogElement
		document.body.appendChild(element)
		element.showModal()
	}

	closeModal(modal: Modal) {
		const index = this.modals.indexOf(modal)
		if (index == -1) throw new Error("App.closeModal(): modal not opened")

		if (index == this.modals.length - 1) {
			const element = modal.element as HTMLDialogElement
			element.close()
			element.remove()
		}
		this.modals.splice(index, 1)

		const previous = this.getCurrentModal()
		if (!previous) return

		const element = previous.element as HTMLDialogElement
		element.showModal()
	}

	getCurrentModal(): Modal | undefined {
		return this.modals[this.modals.length - 1]
	}
}
