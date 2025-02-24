import Component from "./Component";

export default abstract class Form extends Component {

	public readonly body: HTMLDivElement
	public readonly titleElement: HTMLSpanElement

	constructor(title: string, { id, classes }: { id?: string, classes?: string[] }) {
		const cls = ["form"]
		if (classes) cls.push(...classes)
		super("div", { id, classes: cls } )

		this.titleElement = document.createElement("span")
		this.titleElement.className = "form-title"
		this.titleElement.textContent = title
		const formHead  = document.createElement("div")
		formHead.className = "form-head"
		formHead.appendChild(this.titleElement)

		const formBody = document.createElement("div")
		formBody.className = "form-body"

		this.element.appendChild(formHead)
		this.element.appendChild(formBody)

		this.body = formBody
	}

	abstract reset(...args: any[]): void

}
