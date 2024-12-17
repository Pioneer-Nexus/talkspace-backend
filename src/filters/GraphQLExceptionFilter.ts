import { ILoggerService } from "@/infrastructures/logger";
import { BaseException } from "@/utils/exception";
import { ArgumentsHost, Catch } from "@nestjs/common";
import { GqlContextType, GqlExceptionFilter } from "@nestjs/graphql";
import { Response } from "express";

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
	constructor(private readonly loggerService: ILoggerService) {}

	catch(exception: BaseException, host: ArgumentsHost) {
		const isGraphql = host.getType<GqlContextType>() === "graphql";

		if (!isGraphql) {
			const ctx = host.switchToHttp();
			const response = ctx.getResponse<Response>() as Response;
			const request = ctx.getRequest<Request>();
			const status = exception.getStatus?.();

			return response.status(status ?? 500).json({
				statusCode: status ?? 500,
				timestamp: new Date().toISOString(),
				path: request.url,
				message: exception.message,
				...exception
			});
		}

		const { cause, context, stackTraceList, stack, statusCode, message, code, parameters } = exception;

		const responseException = {
			cause,
			context,
			stackTraceList,
			stack,
			statusCode,
			message,
			code,
			parameters,
		};

		this.loggerService.setContext(exception.name);
		this.loggerService.error(exception.message, {
			exception: responseException,
		});

		exception.extensions = {
			code,
		};

		return exception;
	}
}
