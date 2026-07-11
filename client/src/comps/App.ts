import { ClientEvent, RoomEvent } from "matrix-js-sdk"
import { initMatrixClient, matrix } from "../matrix"
import RoomList from "./RoomList"
import Component from "./Component"
import Form from "./forms/Form"
import View from "./views/View"
import Modal from "./Modal"

/** 
 * Keyboard- and layout-independent key codes that trigger autofocus
 * 
 * Keys starting with "Key" or "Digit" don't need to be listed explictly.  
 * AltGraph is layout-dependent and must not be listed.
 * Numpad number keys and NumpadDecimal are dependent on Numpad key state and must not be listed.
 */
const autofocusCodes = [
	// Row 1 (top)
	"Backquote",
	"Minus",
	"Equal",
	"Backspace",
	// Row 2
	"BracketLeft",
	"BracketRight",
	"Enter",
	// Row 3
	"CapsLock",
	"Semicolon",
	"Quote",
	"Backslash",
	// Row 4
	"ShiftLeft",
	"IntlBackslash",
	"Period",
	"Comma",
	"Slash",
	// Row 5
	"Space",
	// Numpad
	"NumpadDivide",
	"NumpadMultiply",
	"NumpadSubtract",
	"NumpadAdd",
]

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

		document.addEventListener("keydown", event => {
			const code = event.code // keyboard-/layout-independent key code
			const key  = event.key  // key (respects layout, modifiers, and numpad key)
			// console.log("keydown event fired on", event.target, "for key", code, key)
			// console.log("modifiers:", ["ctrl", "shift", "alt", "meta"].filter(mod => event[mod + "Key"]).join(", "))

			if (event.altKey || event.ctrlKey || event.metaKey) {
				// console.log("modifier detected, skip")
				return
			}

			if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || (event.target instanceof HTMLDivElement && event.target.hasAttribute("contenteditable"))) {
				// console.log("is input, skip")
				return
			}

			if (!code.startsWith("Key") && !code.startsWith("Digit") && !autofocusCodes.includes(code) && key != "AltGraph" && isNaN(Number(key)) && key != ",") {
				// console.log("key doesn't trigger autofocus, skip")
				return
			}

			this.autofocus(true)
		})
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

		this.autofocus()
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

		modal.form.defaultTextInput?.focus()
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

	autofocus(textOnly: boolean = false) {
		const modal = this.getCurrentModal()
		const getter = textOnly ? "defaultInput" : "defaultTextInput"

		if (modal) {
			modal.form[getter]?.focus()
		} else {
			this.currentView?.[getter]?.focus()
		}
	}
}
