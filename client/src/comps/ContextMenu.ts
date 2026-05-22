import { MaybePromise } from "../types"
import Component from "./Component"

export interface ContextMenuItem {
	label: string
	action: () => MaybePromise<void>
}

export default class ContextMenu extends Component {
	public readonly trigger: HTMLElement

	constructor(className: string, trigger: HTMLElement) {
		super("div", { classes: ["context-menu", className] })

		this.element.popover = "manual"

		this.trigger = trigger

		let open = false
		this.trigger.addEventListener("contextmenu", e => {
			e.preventDefault()
			const elem = this.element as HTMLDialogElement
			elem.style.left = `${e.clientX}px`
			elem.style.top = `${e.clientY}px`
			const hide = (event: PointerEvent) => {
				if (!open) {
					open = true
					return
				}
				if (this.trigger.contains(event.target as Node)) return
				console.log("Hiding context menu")
				elem.hidePopover()
				document.removeEventListener("click", hide)
				document.removeEventListener("contextmenu", hide)
				open = false
			}
			document.addEventListener("click", hide)
			document.addEventListener("contextmenu", hide)

			elem.showPopover({ source: this.trigger })
		})
	}

	reset(items: ContextMenuItem[]): void {
		this.element.innerHTML = ""
		items.forEach(item => {
			const el = document.createElement("div")
			el.className = "context-menu-item"
			el.textContent = item.label
			el.addEventListener("click", async () => {
				await item.action()
				this.element.hidePopover()
			})
			this.element.appendChild(el)
		})
	}
}
