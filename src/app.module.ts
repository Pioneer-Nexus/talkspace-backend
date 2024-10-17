import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppConfigModule } from "./infrastructures/config";
import { AppGraphQLModule } from "./infrastructures/graphql";
import { AppResolver } from "./app.resolver";
import { APP_FILTER } from "@nestjs/core";
import { GraphQLExceptionFilter } from "./filters/GraphQLExceptionFilter";
import { AppDatabaseModule } from "./infrastructures/database";
import { CatModule } from "./modules/cat";
import { AppLoggerModule } from "./infrastructures/logger";
import {
	CorrelationMiddleware,
	CorrelationModule,
} from "./infrastructures/correlation-id";

@Module({
	imports: [
		AppConfigModule,
		AppGraphQLModule,
		AppDatabaseModule,
		AppLoggerModule,
		CatModule,
		CorrelationModule,
	],
	controllers: [AppController],
	providers: [
		AppResolver,
		{
			provide: APP_FILTER,
			useClass: GraphQLExceptionFilter,
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CorrelationMiddleware).forRoutes("");
	}
}
