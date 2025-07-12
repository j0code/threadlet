import path from "path"

export function safeJoin(base: string, target: string): string | null {
	const targetPath = path.posix.normalize("/" + target)
	const resolved   = path.posix.join(base, targetPath)
	const relative = path.posix.relative(base, resolved)
	if (relative.startsWith("..") || path.isAbsolute(relative)) return null
	return resolved
}
