import {
	CallHandler,
	ExecutionContext,
	Inject,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { Observable, tap } from "rxjs";
import { CorrelationService } from "../correlation-id";
import { ILoggerService } from "./adapter";
import { LogType } from "./types/log-type";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(
		private readonly loggerService: ILoggerService,
		@Inject() private readonly correlationService: CorrelationService,
	) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Observable<any> | Promise<Observable<any>> {
		const startDate = new Date();

		if (context.getType<GqlContextType>() === "graphql") {
			const gqlContext = GqlExecutionContext.create(context);
			const info = gqlContext.getInfo();

			const req: Request = gqlContext.getContext().req;

			const ip = req.socket.remoteAddress;
			const userAgent = req.headers["user-agent"];

			const parentType = info.parentType.name;
			const fieldName = info.fieldName;
			const body = info.fieldNodes[0]?.loc?.source?.body;
			const message = `GraphQL - ${parentType} - ${fieldName}`;

			const trace = {
				body,
				handler: gqlContext.getHandler().name,
				args: gqlContext.getArgs(),
			};

			this.loggerService.info(message, {
				version: "1.0.0",
				type: LogType.REQUEST,
				context: trace.handler,
				trace,
				userInfo: {
					ip,
					userAgent,
				},
			});

			return next.handle().pipe(
				tap({
					next: (val: unknown): void => {
						this.logNext(
							val,
							context,
							trace.handler,
							this.correlationService.getCorrelationId(),
							startDate,
						);
					},
				}),
			);
		}

		return next.handle();
	}

	private logNext(
		body: unknown,
		context: ExecutionContext,
		handler: string,
		requestId: string,
		startDate: Date,
	): void {
		if (context.getType() === "http") {
		}

		if (context.getType<GqlContextType>() === "graphql") {
			const time = new Date().getTime() - startDate.getTime();

			this.loggerService.info(`Response from ${requestId} + ${time}ms`, {
				requestId,
				version: "1.0.0",
				type: LogType.RESPONSE,
				context: `${handler} - response`,
				time,
			});
		}
	}
}
