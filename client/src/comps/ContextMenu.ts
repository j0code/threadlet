import Component from "./Component";

export default class ContextMenu extends Component {
	public readonly content: HTMLElement
	public readonly trigger: HTMLElement

	constructor(tagName: keyof HTMLElementTagNameMap, { id, classes }: { id?: string, classes?: string[] }) {
		super("div", { classes: ["context-menu"] })

		this.content = document.createElement(tagName)
		if (id) this.content.id = id
		this.content.classList.add("context-menu-content")
		if (classes) this.content.classList.add(...classes)
		
		this.element.appendChild(this.content)

		this.trigger = document.createElement("div")
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
}