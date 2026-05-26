import { app } from "../../main"
import { twemojiParse } from "../../md"
import { MaybePromise } from "../../types"
import Component from "../Component"
import Modal from "../Modal"

export default abstract class Form<
	ResetArgs extends Array<unknown> = Array<unknown>,
> extends Component {
	public readonly body: HTMLDivElement
	public readonly titleElement: HTMLSpanElement

	constructor(
		title: string,
		{ id, classes }: { id?: string; classes?: string[] }
	) {
		const cls = ["form"]
		if (classes) cls.push(...classes)
		super("form", { id, classes: cls })

		this.titleElement = document.createElement("span")
		this.titleElement.className = "form-title"
		this.titleElement.innerHTML = twemojiParse(title)
		const formHead = document.createElement("div")
		formHead.className = "form-head"
		formHead.appendChild(this.titleElement)

		const formBody = document.createElement("div")
		formBody.className = "form-body"

		this.element.appendChild(formHead)
		this.element.appendChild(formBody)

		this.body = formBody

		this.element.addEventListener("submit", async e => {
			e.preventDefault()
			await this.submit(e.submitter!.id)
		})
	}

	abstract reset(...args: ResetArgs): void
	abstract submit(id: string): MaybePromise<void>

	openModal(...args: ResetArgs) {
		this.reset(...args)

		const modal = new Modal(this)
		app.openModal(modal)
	}

	get defaultTextInput(): HTMLElement | undefined {
		const form = this.element as HTMLFormElement
		return Array.from(form.elements).find(isTextInput)
	}

	get defaultInput(): HTMLElement | undefined {
		const form = this.element as HTMLFormElement
		return Array.from(form.elements).find(isFormInput)
	}
}

function isFormInput(formControl: Element): formControl is HTMLElement {
	if (formControl instanceof HTMLFieldSetElement) return false
	if (formControl instanceof HTMLOutputElement) return false
	return true
}

function isTextInput(formControl: Element): formControl is HTMLElement {
	if (formControl instanceof HTMLTextAreaElement) return true
	if (formControl instanceof HTMLInputElement) {
		return ["text", "number", "email", "password", "search", "tel", "url"].includes(formControl.type)
	}
	return false
}