import { Marked, MarkedExtension, RendererObject, TokenizerAndRendererExtension, TokenizerObject } from "marked"
import { markedHighlight } from "marked-highlight"
import hljs from "highlight.js"
import DOMPurify from "dompurify"

const marked = new Marked()

// Configure marked
marked.setOptions({
	pedantic: false,
	gfm: true,
	breaks: true
})

// Create an inline extension that tokenizes __underline__ syntax.
const underlineExtension: TokenizerAndRendererExtension = {
	name: 'underline',
	level: 'inline',
	// Only look for '__' in the source string
	start(src) {
		return src.indexOf('__')
	},
	tokenizer(src, tokens) {
		// Match text that starts and ends with __ and has at least one non-whitespace char in between.
		const rule = /^__(?=\S)([\s\S]*?\S)__/
		const match = rule.exec(src)
		if (match) {
		return {
			type: 'underline', // a custom token type
			raw: match[0],
			text: match[1]
		}
		}
		return undefined
	},
	renderer(token) {
		return `<u>${token.text}</u>`
	}
}

// Override the link renderer so that links open in a new tab
const linkRenderer: RendererObject = {
	link(token) {
		const { href, title, text } = token
		let out = `<a href="${href}"`
		if (title) {
			out += ` title="${title}"`
		}
		out += ' target="_blank" rel="noopener noreferrer">'
		out += `${text}</a>`
		return out
	}
}

marked.use({ extensions: [underlineExtension], renderer: linkRenderer}, markedHighlight({
	emptyLangClass: "hljs",
	langPrefix: "hljs language-",
	highlight(code, lang, info) {
		const supported = hljs.getLanguage(lang)
		const language = supported ? lang : "plaintext"
		if (!supported) code = `${lang}\n${code}` // BUG: this for some reason includes text before ``` on the same line :/
		return hljs.highlight(code, { language }).value
	}
}))

// Sanitize configuration (customize as needed)
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
	// Add safe rel attribute to all links
	if (node.tagName === "A") {
		node.setAttribute("rel", "nofollow noopener noreferrer")
	}
})

export function markdownToHtml(markdown: string): string {
	// First parse markdown to HTML
	const rawHtml = marked.parse(markdown, { async: false })
	
	// Then sanitize with DOMPurify
	return DOMPurify.sanitize(rawHtml/*, {
		ADD_ATTR: ["id"], // Allow id attributes for heading anchors
		ALLOW_DATA_ATTR: false,
		FORBID_TAGS: ["style", "script", "applet", "iframe", "object"],
		FORBID_ATTR: ["style", "onerror", "onload"]
	}*/)
}
