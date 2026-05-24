import { MsgType } from "matrix-js-sdk"
import { matrix } from "../matrix"
import Component from "./Component"
import EmojiPicker from "./EmojiPicker"
import PostView from "./PostView"
import RoomView from "./RoomView"
import { Editor, Extension } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import { BubbleMenu } from "@tiptap/extension-bubble-menu"
import { Placeholder } from "@tiptap/extensions/placeholder"
import CodeBlock from "@tiptap/extension-code-block"
import Blockquote from "@tiptap/extension-blockquote"
import { BulletList, OrderedList } from "@tiptap/extension-list"

// Credits to DeepSeek-R1, wow (edited though)
export default class ChatInput extends Component {
	readonly emojiPicker: EmojiPicker
	readonly editor: Editor
	readonly view: PostView | RoomView

	constructor(view: PostView | RoomView) {
		super("div", { id: "chat-input-container" })
		this.view = view

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
		chatInput.classList.add("md")

		const bubbleMenu = this.createBubbleMenu()
		this.element.appendChild(bubbleMenu)

		const enterHandler = () => {
			this.sendMessage()
			return true
		}

		this.editor = new Editor({
			element: chatInput,
			extensions: [
				StarterKit,
				BubbleMenu.configure({
					element: bubbleMenu,
				}),
				Placeholder.configure({
					placeholder: "Type a message..."
				}),
				CodeBlock.configure({
					enableTabIndentation: true,
					tabSize: 2
				}),
				Blockquote,
				BulletList,
				OrderedList,
				Extension.create({
					addKeyboardShortcuts() {
						return {
							"Enter": enterHandler
						}
					}
				})
			]
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
				this.editor.commands.insertContent(emoji.native)
			}
		)

		// Div-engers, Assemble!
		this.element.appendChild(fileUploadLabel)
		this.element.appendChild(chatInput)
		this.element.appendChild(emojiButton)
		this.element.appendChild(this.emojiPicker.element)
	}

	private createBubbleMenu() {
		const bubbleMenu = document.createElement("div")
		bubbleMenu.style.visibility = "hidden"
		bubbleMenu.classList.add("bubble-menu")

		const boldButton = document.createElement("button")
		boldButton.textContent = "B"
		boldButton.addEventListener("click", () => {
			this.editor.chain().focus().toggleBold().run()
		})
		bubbleMenu.appendChild(boldButton)

		const italicButton = document.createElement("button")
		italicButton.textContent = "I"
		italicButton.addEventListener("click", () => {
			this.editor.chain().focus().toggleItalic().run()
		})
		bubbleMenu.appendChild(italicButton)

		const strikeButton = document.createElement("button")
		strikeButton.textContent = "S"
		strikeButton.addEventListener("click", () => {
			this.editor.chain().focus().toggleStrike().run()
		})
		bubbleMenu.appendChild(strikeButton)

		return bubbleMenu
	}

	async createMessage(content: string, formatted: string) {
		if(!(this.view instanceof RoomView)) {
			// TODO
			return
		}

		const room = this.view.getCurrentRoom()
		if (!room) return

		await matrix.sendMessage(room.roomId, {
			body: content,
			formatted_body: formatted,
			msgtype: MsgType.Text,
			format: "org.matrix.custom.html",
		})
	}

	sendMessage() {
		const content = this.editor.getHTML().trim()
		const text = this.editor.getText().trim()
		if (content == "") return
		this.editor.commands.clearContent()

		void this.createMessage(text, content)
	}
}
