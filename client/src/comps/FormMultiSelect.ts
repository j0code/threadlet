import Component from "./Component"

type Option = {
	id: string,
	label: string
}

type MultiSelectOptions = {
	options: Option[],
	placeholder?: string
}

export default class FormMultiSelect extends Component {

	private options: Option[]
    private placeholder: string
    private selectedOptions: Set<string>
    private inputContainer: HTMLDivElement
    private input: HTMLInputElement
    private dropdown: HTMLDivElement
    private pillsContainer: HTMLDivElement

	constructor(options: MultiSelectOptions) {
		super("div", { classes: ["multi-select", "form-input"] })

		this.options = options.options
		this.placeholder = options.placeholder || "Select options..."
		this.selectedOptions = new Set()
		
		// Input and dropdown container
		this.inputContainer = document.createElement("div")
		this.inputContainer.className = "multi-select-input"
		
		// Input element
		this.input = document.createElement("input")
		this.input.type = "text"
		this.input.placeholder = this.placeholder
		
		// Dropdown element
		this.dropdown = document.createElement("div")
		this.dropdown.className = "multi-select-dropdown"
		
		// Pills container
		this.pillsContainer = document.createElement("div")
		this.pillsContainer.className = "multi-select-pills"
		
		// Assemble the component
		this.inputContainer.appendChild(this.input)
		this.inputContainer.appendChild(this.dropdown)
		this.element.appendChild(this.inputContainer)
		this.element.appendChild(this.pillsContainer)

		this.setupEventListeners()
	}
	
	setupEventListeners() {
		this.input.addEventListener("focus", () => {
			this.dropdown.classList.add("show")
			this.createOptions()
		})
		
		this.input.addEventListener("blur", () => {
			setTimeout(() => {
				this.dropdown.classList.remove("show")
			}, 200)
		})
		
		this.input.addEventListener("input", (e: Event) => {
			// @ts-expect-error TODO typing
			this.createOptions(e.target?.value)
		})
		
		this.input.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				this.dropdown.classList.remove("show")
			}
		})
	}
	
	createOptions(filter = "") {
		this.dropdown.innerHTML = ""
		
		const filteredOptions = this.options.filter(option => 
			option.label.toLowerCase().includes(filter.toLowerCase())
		)
		
		if (filteredOptions.length === 0) {
			const noResults = document.createElement("div")
			noResults.className = "no-results"
			noResults.textContent = "No results found"
			this.dropdown.appendChild(noResults)
			return
		}
		
		filteredOptions.forEach(option => {
			const optionElement = document.createElement("div")
			optionElement.className = "multi-select-option"
			
			const optionText = document.createElement("span")
			optionText.textContent = option.label
			
			const checkbox = document.createElement("input")
			checkbox.type = "checkbox"
			checkbox.checked = this.selectedOptions.has(option.id)
			
			optionElement.appendChild(optionText)
			optionElement.appendChild(checkbox)
			
			optionElement.addEventListener("click", (e) => {
				// @ts-expect-error TODO typing
				if (e.target.tagName === "INPUT") return
				
				this.toggleOption(option.id)
			})
			
			this.dropdown.appendChild(optionElement)
		})
	}
	
	toggleOption(optionId: string) {
		if (this.selectedOptions.has(optionId)) {
			this.selectedOptions.delete(optionId)
		} else {
			this.selectedOptions.add(optionId)
		}
		this.updatePills()
		this.createOptions(this.input.value)
	}
	
	updatePills() {
		this.pillsContainer.innerHTML = ""
		
		this.selectedOptions.forEach(option => {
			const pill = document.createElement("div")
			pill.className = "multi-select-pill"
			
			const pillText = document.createElement("span")
			pillText.textContent = option
			
			const pillRemove = document.createElement("span")
			pillRemove.className = "multi-select-pill-remove"
			pillRemove.innerHTML = "&times"
			
			pill.addEventListener("click", () => {
				this.toggleOption(option)
			})
			
			pill.appendChild(pillText)
			pill.appendChild(pillRemove)
			this.pillsContainer.appendChild(pill)
		})
	}
	
	get value() {
		return Array.from(this.selectedOptions)
	}
	
	getElement() {
		return this.element
	}
}