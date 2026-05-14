import FormButton from "./FormButton";

export default class SubmitButton extends FormButton {
	constructor(id: string, value: string) {
		super(id, value, () => {}, "submit")
	}
}