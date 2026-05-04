import { GatewayEvents } from "./v0/types.js"

type EventNames = GatewayEvents["event"]
type EventListener<Event extends EventNames = EventNames> = (data: Extract<GatewayEvents, { event: Event }>["data"]) => void

export default class EventEmitter {

	private listeners: Map<string, EventListener[]>

	constructor() {
		this.listeners = new Map()
	}

	/**
	 * Add event listener
	 * @param event event name
	 * @param cb callback
	 */
	on<Event extends EventNames>(event: Event, cb: EventListener<Event>) {
		const listeners = this.listeners.get(event) ?? []
		listeners.push(cb as unknown as EventListener)
		this.listeners.set(event, listeners)
	}

	/**
	 * Remove event listener
	 * @param event event name
	 * @param cb callback
	 */
	off<Event extends GatewayEvents["event"]>(event: Event, cb: EventListener<Event>) {
		const listeners = this.listeners.get(event) ?? []
		const index = listeners.indexOf(cb as unknown as EventListener)
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