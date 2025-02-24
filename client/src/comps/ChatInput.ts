import Component from "./Component"

// Credits to DeepSeek-R1, wow (edited though)
export default class ChatInput extends Component {

	constructor() {
		super("div", { id: "chat-input-container" })

		// Create file upload button
		const fileUploadLabel = document.createElement("label")
		fileUploadLabel.className = "file-upload-button"
		
		const fileInput = document.createElement("input")
		fileInput.type = "file"
		fileInput.className = "hidden-file-input"
		
		fileUploadLabel.appendChild(fileInput)

		// Create chat input
		const chatInput = document.createElement("div")
		chatInput.className = "chat-input"
		chatInput.setAttribute("contenteditable", "true")
		chatInput.setAttribute("placeholder", "Message #channel")
		chatInput.addEventListener("keypress", e => {
			if (e.code == "Enter" && !e.shiftKey) {
				console.log("Send MSG:", chatInput.innerText)
				e.preventDefault()
			}
		})
		chatInput.addEventListener('input', () => { // this fixes weird browser behavior
			if (chatInput.innerHTML == "<br>") chatInput.innerHTML = ""
		})

		// Create emoji button
		const emojiButton = document.createElement("button")
		emojiButton.className = "emoji-button"

		// Div-engers, Assemble!
		this.element.appendChild(fileUploadLabel)
		this.element.appendChild(chatInput)
		this.element.appendChild(emojiButton)
	}

}
