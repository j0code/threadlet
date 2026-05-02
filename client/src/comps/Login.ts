import { matrix } from "../matrix";
import Component from "./Component";

export default class Login extends Component {

	constructor() {
		super("div", { id: "login" })

		//this.element.style.background = "url('/2pills.png') center center / contain no-repeat fixed"
		this.element.style.width = "100%"
		this.element.style.height = "100%"

		let title = document.createElement("h1")
		title.textContent = "Welcome to Threadlet!"
		title.id = "loginTitle"
		this.element.appendChild(title)

		let morpheusImg = document.createElement("img")
		morpheusImg.src = "/2pills.png"
		morpheusImg.id = "morpehusImg"
		this.element.appendChild(morpheusImg)

		let loginButton = document.createElement("button")
		loginButton.textContent = "Login"
		loginButton.style.bottom = "calc(anchor(bottom) + 10.5vw)"
		loginButton.style.left   = "calc(anchor(left)   + 12.5vw)"
		loginButton.style.transform = "translateX(-50%) translateY(50%)"
		loginButton.classList.add("loginButton");
		this.element.appendChild(loginButton)

		loginButton.addEventListener("click", () => this.loginDialog())

		let registerButton = document.createElement("button")
		registerButton.textContent = "Register"
		registerButton.style.bottom = "calc(anchor(bottom) +  9vw)"
		registerButton.style.right  = "calc(anchor(right)  + 17vw)"
		registerButton.style.transform = "translateX(50%) translateY(50%)"
		registerButton.classList.add("loginButton");
		this.element.appendChild(registerButton)

		registerButton.addEventListener("click", () => alert("Morpheus declines your registration request."))

// 		this.element.innerHTML = `
// <h1 style="margin: 0;">Login</h1>
// <input type="text" id="loginHomeserver" placeholder="Homeserver URL" value="https://matrix.org" />
// <input type="text" id="loginUsername" placeholder="Username" />
// <input type="password" id="loginPassword" placeholder="Password" />
// <button id="loginSubmit">Login</button>
// `;

// 		this.element.querySelector("#loginSubmit")!.addEventListener("click", async () => {
// 			const homeserver = (this.element.querySelector("#loginHomeserver") as HTMLInputElement).value
// 			const username = (this.element.querySelector("#loginUsername") as HTMLInputElement).value
// 			const password = (this.element.querySelector("#loginPassword") as HTMLInputElement).value

// 			alert(`Logging in with:\nHomeserver: ${homeserver}\nUsername: ${username}\nPassword: ${password}`);
// 		});
	}

	loginDialog() {
		const el = document.createElement("dialog")
		el.innerHTML = `
			<h1 style="margin-top: 0;">Login</h1>
			<input type="text" id="loginHomeserver" placeholder="Homeserver URL" value="https://matrix.org" />
			<button id="loginHSSubmit">Login</button>
			<input type="text" id="loginUsername" placeholder="Username" style="display: none;" />
			<input type="password" id="loginPassword" placeholder="Password" style="display: none;" />
			<button id="loginSubmit" style="display: none;">Login</button>
		`
		document.body.appendChild(el)
		el.showModal()

		el.querySelector<HTMLInputElement>("#loginHomeserver")!.value = localStorage.getItem("homeserver") || "https://matrix.org"

		el.querySelector("#loginHSSubmit")!.addEventListener("click", async () => {
			const homeserver = (el.querySelector("#loginHomeserver") as HTMLInputElement).value
			if(homeserver != localStorage.getItem("homeserver")) {
				localStorage.setItem("homeserver", homeserver);
				location.reload();
				return;
			}
			const flows = await matrix.loginFlows()
			if(!flows.flows.some(flow => flow.type == "m.login.password")) {
				alert("No supported login flows found");
				return;
			}
			el.querySelector<HTMLInputElement>("#loginHomeserver")!.style.display = "none"
			el.querySelector<HTMLButtonElement>("#loginHSSubmit")!.style.display = "none"
			el.querySelector<HTMLInputElement>("#loginUsername")!.style.display = "block"
			el.querySelector<HTMLInputElement>("#loginPassword")!.style.display = "block"
			el.querySelector<HTMLButtonElement>("#loginSubmit")!.style.display = "block"
		});

		el.querySelector<HTMLButtonElement>("#loginSubmit")!.addEventListener("click", async () => {
			const username = el.querySelector<HTMLInputElement>("#loginUsername")!.value;
			const password = el.querySelector<HTMLInputElement>("#loginPassword")!.value;
			try {
				const res = await matrix.loginRequest({
					type: "m.login.password",
					identifier: {
						type: "m.id.user",
						user: username
					},
					password: password
				});
				console.log(res);
				localStorage.setItem("accessToken", res.access_token);
				localStorage.setItem("userId", res.user_id);
				localStorage.setItem("deviceId", res.device_id);
				// localStorage.setItem("refreshToken", res.refresh_token);
				location.reload();
			} catch(e: any) {
				console.error(e.httpStatus);
				alert("Login failed, " + (e.httpStatus === 403 ? "invalid username or password" : "an unknown error occurred"));
			}
		});
	}

}