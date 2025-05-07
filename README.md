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
2. setup a cloudflare tunnel
3. set the root mapping in Activites > URL Mappings to the Cloudflare tunnel url without the `https://`
4. enable Activities in Acitvities > Settings
5. optionally invite others to test the app in App Testers
> [!NOTE]
> You have to repeat step 3 every time you create a fresh cloudflare tunnel.

### Server
1. cd into the `server` directory
2. copy the content of `server/config.example.yson` into `server/config.yson`
3. update the config with the OAuth secret and id from the OAuth2 tab
4. run `npm install`
5. run `tsc`
6. run `node .` to start the server

### Cloudflare Tunnel
> [!NOTE]
> These steps are for creating a temporary Cloudflare tunnel for development. For production, you should create a permanent one instead.
1. run `cloudflared tunnel --url http://localhost:5173`
2. wait for Cloudflare to establish the tunnel
3. It should print the url in the terminal, something like `https://abcd.def.ghijk.lmnop.trycloudflare.com`. Copy that url, you will need it later.

### Client
1. copy the content of `example.env` into `.env`
2. update the env with the client id of your app
3. cd into the `client` directory
4. update `client/vite.config.js` with your Cloudflare tunnel url without the `https://` (`server.allowedHosts`)
5. run `npm install`
6. run `npm run dev` to start vite (you can also build first)

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