# Threadlet

Threadlet is a feature-rich, QoL improvement packed, replacement for Discord Forums.

## Features

- More forum tags
- Advanced markdown
- Up to 4096 characters per message
- Completely for free, no hidden fees, or ads

## Usage

Currently limited to invited users. If you want to test Threadlet, feel free to message @j0code.

If you have access to the app, it should show up when you search for "Threadlet" in the "Apps & Commands" menu in Discord.

## Hosting / Devlopment

### Discord Application
1. create a Discord Application through the [Developer Portal](https://discord.dev/)
2. add a redirect URI (OAuth2 tab); https://localhost/ is fine.
3. set the root mapping in Activites > URL Mappings to a development domain (without https://).
4. enable Activities in Acitvities > Settings
5. optionally invite others to test the app in App Testers

### Server
1. cd into the `server` directory
2. copy the content of `server/config.example.yson` into `server/config.yson`
3. update the config with the OAuth secret and id from the OAuth2 tab
4. run `npm install`
5. run `tsc`
6. run `node .` to start the server

### Client
1. copy the content of `example.env` into `.env`
2. update the env with the client id of your app
3. cd into the `client` directory
4. create `client/dev_config.yson` (see `client/vite.config.js` for reference)
5. run `npm install`
6. run `npm run dev` to start vite
> [!NOTE]
> In prod, skip (6.), run `npm run build`, and make sure your reverse proxy connects to the server directly.
> The server will serve from `/client/dist` (configurable in `server/config.yson`).

### Development
When you want to help development, remember to run the typescript compiler in the `server` directory.
Tip: run tsc in watch mode: `tsc --watch`

The `api` directory does not need compilation as the JSR does that automatically upon publishing a new version.

The `client` directory does not need it either since vite does that automatically.

## API

See [api/README.md](./api/README.md)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the GPL-3-or-later License. See the [LICENSE](api/LICENSE) file for details.