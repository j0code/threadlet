/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_DISCORD_CLIENT_ID: string
	// Add other environment variables here...
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
