import { ILoggerService } from "@/infrastructures/logger";
import { BaseException } from "@/utils/exception";
import { ArgumentsHost, Catch } from "@nestjs/common";
import { GqlContextType, GqlExceptionFilter } from "@nestjs/graphql";

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
	constructor(private readonly loggerService: ILoggerService) {}

	catch(exception: BaseException, host: ArgumentsHost) {
		const isGraphql = host.getType<GqlContextType>() === "graphql";

		if (!isGraphql) {
			// do sth...
			return;
		}

		const { cause, context, stackTraceList, stack, statusCode, message } = exception;

		this.loggerService.setContext(exception.name);
		this.loggerService.error(exception.message, {
			exception: {
				cause,
				context,
				stackTraceList,
				stack,
				statusCode,
				message,
			},
		});
	}
}
