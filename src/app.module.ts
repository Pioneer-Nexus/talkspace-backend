import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppConfigModule } from "./infrastructures/config";
import { AppGraphQLModule } from "./infrastructures/graphql";
import { AppResolver } from "./app.resolver";
import { APP_FILTER } from "@nestjs/core";
import { GraphQLExceptionFilter } from "./filters/GraphQLExceptionFilter";

@Module({
	imports: [AppConfigModule, AppGraphQLModule],
	controllers: [AppController],
	providers: [
		AppResolver,
		{
			provide: APP_FILTER,
			useClass: GraphQLExceptionFilter,
		},
	],
})
export class AppModule {}
