import { MaybePromise } from "../types"
import Component from "./Component"

export interface ContextMenuItem {
	label: string
	action: () => MaybePromise<void>
}

export interface ContextMenuOptions {
	ignoredElementTypes?: (keyof HTMLElementTagNameMap)[]
}

export default class ContextMenu extends Component {
	public readonly trigger: HTMLElement
	public readonly options: ContextMenuOptions

	constructor(className: string, trigger: HTMLElement, options?: ContextMenuOptions) {
		super("div", { classes: ["context-menu", className] })

		this.options = options || {}

		this.element.popover = "manual"

		this.trigger = trigger

		let open = false
		this.trigger.addEventListener("contextmenu", e => {
			const elementTag = (e.target as HTMLElement).tagName.toLowerCase() as keyof HTMLElementTagNameMap
			if (this.options.ignoredElementTypes?.includes(elementTag)) return
			e.preventDefault()
			if (this.element.children.length === 0) return
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
