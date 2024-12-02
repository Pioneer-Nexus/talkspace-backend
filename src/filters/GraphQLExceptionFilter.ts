import { ILoggerService } from "@/infrastructures/logger";
import { BaseException } from "@/utils/exception";
import { ArgumentsHost, Catch } from "@nestjs/common";
import { GqlContextType, GqlExceptionFilter } from "@nestjs/graphql";
import { GraphQLError } from "graphql";
// import { LoggerService } from 'src/logger/logger.service';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
	constructor(private readonly loggerService: ILoggerService) {}

	catch(exception: BaseException, host: ArgumentsHost) {
		const isGraphql = host.getType<GqlContextType>() === 'graphql';

		if (!isGraphql) {
			// do sth...
			return;
		}

		const filteredException = JSON.parse(
			JSON.stringify(exception, (key, val) =>
				key.includes(".") ? undefined : val,
			),
		);
		this.loggerService.setContext(filteredException.name);
		this.loggerService.error(exception.code, {
			filteredException: {
				...filteredException,
				response: "",
			},
			exception: {
				...exception,
				response: "",
			},
		});
		throw new GraphQLError(exception.message, {
			extensions: filteredException,
		});
	}
}
