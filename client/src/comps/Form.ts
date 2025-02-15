import Component from "./Component";

export default class Form extends Component {

	public readonly body: HTMLDivElement

	constructor(id: string, title: string) {
		super("div", id, "form")

		const formTitle = document.createElement("span")
		formTitle.className = "form-title"
		formTitle.textContent = title
		const formHead  = document.createElement("div")
		formHead.className = "form-head"
		formHead.appendChild(formTitle)

		const formBody = document.createElement("div")
		formBody.className = "form-body"

		this.element.appendChild(formHead)
		this.element.appendChild(formBody)

		this.body = formBody
	}

}
