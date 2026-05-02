import DOMPurify from "dompurify";

/*
From spec (10.2.1.1.):
Clients should limit the HTML they render to avoid Cross-Site Scripting, HTML injection, and similar attacks.
The strongly suggested set of HTML tags to permit, denying the use and rendering of anything else, is:
del, h1, h2, h3, h4, h5, h6, blockquote, p, a, ul, ol, sup, sub, li, b, i, u, strong, em, s, code, hr,
br, div, table, thead, tbody, tr, th, td, caption, pre, span, img, details, summary.

Not all attributes on those tags should be permitted as they may be avenues for other disruption attempts,
such as adding onclick handlers or excessively large text.
Clients should only permit the attributes listed for the tags below.
Where data-mx-bg-color and data-mx-color are listed, clients should translate the value
(a # character followed by a 6-character hex color code) to the appropriate CSS/attributes for the tag.
Tag  | Permitted Attributes
-----|----------------------
span | data-mx-bg-color, data-mx-color, data-mx-spoiler (see spoiler messages), data-mx-maths (see mathematical messages)
a    | target, href (provided the value is not relative and has a scheme matching one of: https, http, ftp, mailto, magnet)
img  | width, height, alt, title, src (provided it is a Matrix Content (mxc://) URI)
ol   | start
code | class (only classes which start with language- for syntax highlighting)
div  | data-mx-maths (see mathematical messages)

Additionally, web clients should ensure that all a tags get a rel="noopener" to prevent the target page from referencing the client’s tab/window.
*/
export function purifyHTML(html: string): string {
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			"del", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "a", "ul", "ol", "sup", "sub", "li", "b", "i", "u", "strong", "em", "s", "code", "hr",
			"br", "div", "table", "thead", "tbody", "tr", "th", "td", "caption", "pre", "span", "img", "details", "summary", "#text"
		],
		ADD_ATTR: [
			"data-mx-bg-color", "data-mx-color", "data-mx-spoiler", "data-mx-maths",
			"target", "href",
			"width", "height", "alt", "title", "src",
			"start",
			"class"
		],
	})
}
