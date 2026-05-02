import { MatrixEvent } from "matrix-js-sdk";
import EventMessageBase from "./EventMessageBase";
import { matrix } from "../../matrix";

export default class RoomNameEvent extends EventMessageBase {
	constructor(msg: MatrixEvent) {
		super(msg);
		this.reset();
	}

	async reset() {
		await super.reset();
		
		let author = matrix.getUser(this.message.getSender() || "");
		this.contentElement.textContent = `${author?.displayName || this.message.getSender()} changed the room name to ${this.message.getContent().name}`;
	}
}