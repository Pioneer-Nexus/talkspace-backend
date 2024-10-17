import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";

@Injectable()
export class CorrelationService {
	private readonly asyncLocalStorage = new AsyncLocalStorage<
		Map<string, any>
	>();

	constructor() {}

	runWithContext(fn: (...args: any[]) => void) {
		const store = new Map<string, any>();
		this.asyncLocalStorage.run(store, fn);
	}

	setCorrelationId(correlationId: string) {
		const store = this.asyncLocalStorage.getStore();
		if (store) {
			store.set("correlationId", correlationId);
		}
	}

	getCorrelationId() {
		const store = this.asyncLocalStorage.getStore();
		return store ? store.get("correlationId") : undefined;
	}
}
