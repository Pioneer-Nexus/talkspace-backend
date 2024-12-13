import { AuthModule } from "@/modules/auth";
import { UserModule } from "@/modules/user/user.module";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AppResolver } from "./app.resolver";
import { GraphQLExceptionFilter } from "./filters/GraphQLExceptionFilter";
import { AppCacheModule } from "./infrastructures/cache";
import { AppConfigModule } from "./infrastructures/config";
import { CorrelationMiddleware, CorrelationModule } from "./infrastructures/correlation-id";
import { AppDatabaseModule } from "./infrastructures/database";
import { AppGraphQLModule } from "./infrastructures/graphql";
import { AppLoggerModule } from "./infrastructures/logger";
import { ChatRoomModule } from "./modules/chat-room/chat-room.module";
import { NotificationModule } from './modules/notification/notification.module';

@Module({
	imports: [
		AppCacheModule,
		AppConfigModule,
		AppGraphQLModule,
		AppDatabaseModule,
		AppLoggerModule,
		AuthModule,
		CorrelationModule,
		UserModule,
		ChatRoomModule,
		NotificationModule,
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
