export abstract class ILoggerService {
	abstract setContext(contextName: string): void;

	abstract getRequestData(): {
		context: string;
		correlationId: string;
	};

	abstract log(message: string, meta?: any): void;

	abstract info(message: string, meta?: any): void;

	abstract error(message: string, meta?: Record<string, any>): void;

	abstract warn(message: string, meta?: any): void;

	abstract debug(message: string, meta?: any): void;
}
