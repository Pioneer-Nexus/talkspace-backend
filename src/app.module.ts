import { MiddlewareConsumer, Module } from "@nestjs/common";
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
import { AppCacheModule } from "./infrastructures/cache";
import { AuthModule } from "@/modules/auth";
import { UserModule } from "@/modules/user/user.module";
import { ChatRoomModule } from "./modules/chat-room/chat-room.module";

@Module({
	imports: [
		AppCacheModule,
		AppConfigModule,
		AppGraphQLModule,
		AppDatabaseModule,
		AppLoggerModule,
		AuthModule,
		CatModule,
		CorrelationModule,
		UserModule,
		ChatRoomModule,
	],
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
