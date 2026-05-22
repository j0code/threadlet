import { MaybePromise } from "../types"
import Component from "./Component"

export interface ContextMenuItem {
	label: string
	action: () => MaybePromise<void>
}

export default class ContextMenu extends Component {
	public readonly content: HTMLElement
	public readonly trigger: HTMLElement

	constructor(
		tagName: keyof HTMLElementTagNameMap,
		{ id, classes }: { id?: string; classes?: string[] },
		trigger: HTMLElement
	) {
		super("div", { classes: ["context-menu"] })

		this.content = document.createElement(tagName)
		if (id) this.content.id = id
		this.content.classList.add("context-menu-content")
		if (classes) this.content.classList.add(...classes)

		this.element.appendChild(this.content)

		this.trigger = trigger
		this.element.appendChild(this.trigger)

		this.trigger.addEventListener("contextmenu", e => {
			e.preventDefault()
			this.content.style.left = `${e.clientX}px`
			this.content.style.top = `${e.clientY}px`
			this.content.classList.add("shown")
			const hide = () => {
				console.log("Hiding context menu")
				this.content.classList.remove("shown")
				document.removeEventListener("click", hide)
				document.removeEventListener("contextmenu", hide)
			}
			document.addEventListener("click", hide)
			requestAnimationFrame(() => {
				document.addEventListener("contextmenu", hide)
			})
		})
	}

	reset(items: ContextMenuItem[]): void {
		this.content.innerHTML = ""
		items.forEach(item => {
			const el = document.createElement("div")
			el.className = "context-menu-item"
			el.textContent = item.label
			el.addEventListener("click", async () => {
				await item.action()
				this.content.classList.remove("shown")
			})
			this.content.appendChild(el)
		})
	}
}
