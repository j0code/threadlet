export default abstract class Component {

	public readonly element: HTMLElement

	constructor(tagName: keyof HTMLElementTagNameMap, { id, classes }: { id?: string, classes?: string[] }) {
		this.element = document.createElement(tagName)
		if (id) this.element.id = id
		if (classes) this.element.classList.add(...classes)
	}

}
