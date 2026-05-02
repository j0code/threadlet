import { ClientEvent, Room, RoomEvent } from "matrix-js-sdk"
import { initMatrixClient, matrix } from "../matrix"
import ChannelList from "./ChannelList"
import Component from "./Component"
import Form from "./Form"
import View from "./View"
import MemberList from "./MemberList"

export default class App extends Component {
	readonly channelList: ChannelList
	private currentView?: View | Form
	readonly memberList: MemberList

	constructor() {
		super("div", { id: "app" })

		this.channelList = new ChannelList([])
		this.element.appendChild(this.channelList.element)
		this.memberList = new MemberList()
		this.element.appendChild(this.memberList.element)

		matrix.once(ClientEvent.Sync, () => {
			this.updateChannelList();
		})

		matrix.on(RoomEvent.MyMembership, () => {
			this.updateChannelList();
		})

		void initMatrixClient()
	}

	updateChannelList() {
		const rooms = matrix.getRooms()
		this.channelList.reset(rooms)
	}

	renderView(view: View | Form | undefined, ...args: unknown[]) {
		if (this.currentView) {
			this.currentView.element.remove()
		}
		if(!view) return

		void view.reset(...args)
		this.element.insertBefore(view.element, this.memberList.element)
		this.currentView = view
	}

	async updateMemberList(room: Room | null) {
		const members = matrix.getRoom(room?.roomId)?.getMembers() || []
		await this.memberList.reset(members, room?.roomId)
	}

	getCurrentView() {
		return this.currentView
	}
}
