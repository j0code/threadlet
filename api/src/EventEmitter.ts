import { GatewayEvents } from "./v0/types.js"

type EventListener<Event extends GatewayEvents> = (data: Event["data"]) => void

export default class EventEmitter {

	private listeners: Map<string, EventListener<any>[]>

	constructor() {
		this.listeners = new Map()
	}

	/**
	 * Add event listener
	 * @param event event name
	 * @param cb callback
	 */
	on<Event extends GatewayEvents>(event: Event["event"], cb: EventListener<Event>) {
		const listeners = this.listeners.get(event) ?? []
		listeners.push(cb)
		this.listeners.set(event, listeners)
	}

	/**
	 * Remove event listener
	 * @param event event name
	 * @param cb callback
	 */
	off<Event extends GatewayEvents>(event: Event["event"], cb: EventListener<Event>) {
		const listeners = this.listeners.get(event) ?? []
		const index = listeners.indexOf(cb)
		if (index < 0) return
		this.listeners.set(event, listeners.splice(index, 1))
	}

	protected emit<Event extends GatewayEvents>(event: Event["event"], data: Event["data"]) {
		const listeners = this.listeners.get(event) ?? []

		for (const listener of listeners) {
			listener(data)
		}
	}

}