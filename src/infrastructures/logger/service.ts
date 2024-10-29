import { Inject, Injectable, Scope } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { CorrelationService } from "../correlation-id";
import { ILoggerService } from "./adapter";

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ILoggerService {
	private context: string;

	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly correlationService: CorrelationService,
	) {
		super();
	}

	setContext(contextName: string) {
		this.context = contextName;
	}

	getRequestData() {
		return {
			context: this.context,
			correlationId: this.correlationService.getCorrelationId(),
		};
	}

	log(message: string, meta?: any) {
		this.logger.log(message, {
			...this.getRequestData(),
			...meta,
			log_level: "log",
		});
	}

	info(message: string, meta?: any) {
		this.logger.info(message, {
			...this.getRequestData(),
			...meta,
			log_level: "info",
		});
	}

	error(message: string, meta?: Record<string, any>) {
		this.logger.error(message, {
			// ...this.getRequestData(),
			...meta,
			log_level: "error",
		});
	}

	warn(message: string, meta?: any) {
		this.logger.warn(message, {
			...this.getRequestData(),
			...meta,
			log_level: "warn",
		});
	}

	debug(message: string, meta?: any) {
		this.logger.debug(message, {
			...this.getRequestData(),
			...meta,
			log_level: "debug",
		});
	}
}
