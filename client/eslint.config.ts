import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import css from "@eslint/css"
import { defineConfig } from "eslint/config"

export default defineConfig([
	{
		ignores: [
			"dist/**",
			"node_modules/**",
			"tsconfig.json",
			"eslint.config.ts",
			"package-lock.json"
		]
	},
	{ files: ["**/*.{ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
	{
		files: ["**/*.{ts,mts,cts,tsx}"],
		extends: [
			tseslint.configs.recommended,
			tseslint.configs.recommendedTypeChecked,
		],
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
		rules: {
		"@typescript-eslint/no-unused-vars": [
			"error",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			},
		],
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				"checksVoidReturn": {
					"arguments": false
				}
			}
		]
	}
	},
	{ files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
	{
		files: ["**/*.md"],
		plugins: { markdown },
		language: "markdown/gfm",
		extends: ["markdown/recommended"],
		rules: {
			"markdown/no-missing-label-refs": "off",
		}
	},
	{
		files: ["**/*.css"],
		plugins: { css },
		language: "css/css",
		extends: ["css/recommended"],
		rules: {
			"css/use-baseline": "off",
			"css/no-invalid-properties": [
				"error",
				{
					allowUnknownVariables: true
				}
			],
			"css/no-empty-blocks": "off"
		}
	},
])
