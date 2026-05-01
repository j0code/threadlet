import Component from "./Component";

export default class Login extends Component {

	constructor() {
		super("div", { id: "login" })

		this.element.innerHTML = `
<h1>Login</h1>
<input type="text" id="loginHomeserver" placeholder="Homeserver URL" value="https://matrix.org" />
<input type="text" id="loginUsername" placeholder="Username" />
<input type="password" id="loginPassword" placeholder="Password" />
<button id="loginSubmit">Login</button>
`;

		this.element.querySelector("#loginSubmit")!.addEventListener("click", async () => {
			const homeserver = (this.element.querySelector("#loginHomeserver") as HTMLInputElement).value
			const username = (this.element.querySelector("#loginUsername") as HTMLInputElement).value
			const password = (this.element.querySelector("#loginPassword") as HTMLInputElement).value

			alert(`Logging in with:\nHomeserver: ${homeserver}\nUsername: ${username}\nPassword: ${password}`);
		});
	}

}