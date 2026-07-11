import { MatrixEvent, MsgType } from "matrix-js-sdk"
import { matrix } from "../matrix"
import Component from "./Component"
import EmojiPicker from "./EmojiPicker"
import PostView from "./views/PostView"
import RoomView from "./views/RoomView"

// Credits to DeepSeek-R1, wow (edited though)
export default class ChatInput extends Component {
	readonly emojiPicker: EmojiPicker
	readonly chatInput: HTMLDivElement
	replacingEventId: string | null = null

	constructor(view: PostView | RoomView) {
		super("div", { id: "chat-input-container" })

		// Create file upload button
		const fileUploadLabel = document.createElement("label")
		fileUploadLabel.className = "file-upload-button"

		const fileInput = document.createElement("input")
		fileInput.type = "file"
		fileInput.className = "hidden-file-input"

		fileUploadLabel.appendChild(fileInput)

		// Create chat input
		this.chatInput = document.createElement("div")
		this.chatInput.className = "chat-input"
		this.chatInput.setAttribute("contenteditable", "true")
		this.chatInput.setAttribute("placeholder", "Message #channel")
		this.chatInput.addEventListener("keypress", e => {
			if (e.code == "Enter" && !e.shiftKey) {
				const replacingEventId = this.replacingEventId
				e.preventDefault()
				const content = this.chatInput.innerText.trim()
				if (content == "") return
				this.chatInput.innerHTML = ""

				async function createMessage() {
					// const forum_id = view.getCurrentForumId()
					// const post_id  = view.getCurrentPostId()
					// if (!forum_id || !post_id) {
					// 	throw new Error("TODO")
					// }

					// const msg = await api.createMessage(forum_id, post_id, { content })
					// console.log(msg)
					if (view instanceof PostView) {
						// TODO
						return
					}

					const room = view.getCurrentRoom()
					if (!room) return

					if (!replacingEventId) {
						await matrix.sendMessage(room.roomId, {
							body: content,
							msgtype: MsgType.Text,
						})
					} else {
						await matrix.sendMessage(room.roomId, {
							body: "* " + content,
							msgtype: MsgType.Text,
							"m.new_content": {
								body: content,
								msgtype: MsgType.Text,
							},
							// @ts-expect-error the matrix-js-sdk types are terrible
							"m.relates_to": {
								rel_type: "m.replace",
								event_id: replacingEventId,
							},
						})
					}
				}

				console.log("Send MSG:", this.chatInput.innerText)
				void createMessage()
				this.replacingEventId = null
			}
		})
		this.chatInput.addEventListener("input", () => {
			// this fixes weird browser behavior
			if (this.chatInput.innerHTML == "<br>") this.chatInput.innerHTML = ""
		})

		// Create emoji button
		const emojiButton = document.createElement("button")
		emojiButton.className = "emoji-button"
		emojiButton.setAttribute("popovertarget", "chat-input-emoji-picker")
		emojiButton.setAttribute("popovertargetaction", "show")

		// Emoji Picker
		this.emojiPicker = new EmojiPicker(
			"chat-input-emoji-picker",
			"chat-input-container",
			emoji => {
				this.chatInput.textContent += emoji.native
			}
		)

		// Div-engers, Assemble!
		this.element.appendChild(fileUploadLabel)
		this.element.appendChild(this.chatInput)
		this.element.appendChild(emojiButton)
		this.element.appendChild(this.emojiPicker.element)
	}

	startReplacement(event: MatrixEvent) {
		this.replacingEventId = event.getId() || null
		const content = event.getContent()
		if (content.msgtype === MsgType.Text) {
			if (this.chatInput) {
				this.chatInput.textContent = content.body as string || ""
				this.chatInput.focus()
			}
		}
	}
}
