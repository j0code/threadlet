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
		this.content.style.position = "absolute"
		this.content.style.display = "none"
		
		this.element.appendChild(this.content)

		this.trigger = document.createElement("div")
		this.element.appendChild(this.trigger)
		
		this.trigger.addEventListener("contextmenu", e => {
			e.preventDefault()
			this.content.style.left = `${e.clientX}px`
			this.content.style.top = `${e.clientY}px`
			this.content.style.display = ""
			const hide = () => {
				this.content.style.display = "none"
				window.removeEventListener("click", hide)
			}
			window.addEventListener("click", hide)
		})
	}
}