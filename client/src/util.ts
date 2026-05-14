export function relativeTimeFormat(date: Date) {
	const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
	const now = new Date()
	const diff = (date.getTime() - now.getTime()) / 1000

	if (Math.abs(diff) < 60) {
		return rtf.format(Math.round(diff), "second")
	} else if (Math.abs(diff) < 3600) {
		return rtf.format(Math.round(diff / 60), "minute")
	} else if (Math.abs(diff) < 86400) {
		return rtf.format(Math.round(diff / 3600), "hour")
	} else {
		return rtf.format(Math.round(diff / 86400), "day")
	}
}
