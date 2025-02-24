import Component from "./Component"
import ViewHead from "./ViewHead"

export default abstract class View extends Component {

	public readonly head: ViewHead
	protected readonly body: HTMLDivElement

	constructor(title: string, { id, classes }: { id?: string, classes?: string[] }) {
		const cls = ["view"]
		if (classes) cls.push(...classes)
		super("div", { id, classes: cls })

		this.head = new ViewHead(title)
		this.body = document.createElement("div")
		this.body.className = "view-body"

		this.element.append(this.head.element, this.body)
	}

	abstract reset(...args: any[]): void

}
