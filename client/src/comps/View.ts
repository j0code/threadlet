import Component from "./Component"

export default abstract class View extends Component {

	abstract reset(...args: any[]): void

}
