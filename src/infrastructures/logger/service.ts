import { Inject, Injectable, Scope } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { LogType } from "./types/log-type";

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
	private context: string;

	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
	) {}

	setContext(contextName: string) {
		this.context = contextName;
	}

	log(message: string, meta?: any) {
		this.logger.log(message, { context: this.context, ...meta });
	}

	info(message: string, meta?: any) {
		this.logger.info(message, { context: this.context, ...meta });
	}

	error(message: string, meta?: Record<string, any>) {
		this.logger.error(message, {
			context: this.context,
			type: LogType.ERROR,
			...meta,
		});
	}

	warn(message: string, meta?: any) {
		this.logger.warn(message, { context: this.context, ...meta });
	}

	debug(message: string, meta?: any) {
		this.logger.debug(message, { context: this.context, ...meta });
	}
}
