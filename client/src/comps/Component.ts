export default abstract class Component {

	public readonly element: HTMLElement

	constructor(tagName: keyof HTMLElementTagNameMap, id: string, className?: string) {
		this.element = document.createElement(tagName)
		this.element.id = id
		this.element.className = className || ""
	}

}
