import { AppDatabaseModule } from "@/infrastructures/database";
import { AppQueueModule } from "@/infrastructures/queue";
import { SseModule } from "@/infrastructures/server-sent-event/sse.module";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { NotificationController } from "./controllers/notification.controller";
import { NotificationRepository } from "./repositories/notification.repository";
import { NotificationResolver } from "./resolvers/notification.resolver";
import { Notification } from "./schemas/notification.schema";
import { NotificationService } from "./services/notification.service";
import { NotificationConsumer } from "./consumers/notification.consumer";
import { BullModule } from "@nestjs/bull";
import { notificationJob } from "@/core/constants/jobs";
import { AppLoggerModule } from "@/infrastructures/logger";

@Module({
	imports: [
		AppDatabaseModule,
		AppQueueModule,
		AppLoggerModule,
		SseModule,
		UserModule,
		BullModule.registerQueue({
			name: notificationJob.name,
			defaultJobOptions: {
				attempts: 3,
				backoff: 5000,
				removeOnFail: true,
				removeOnComplete: true,
			},
		}),
	],
	controllers: [NotificationController],
	providers: [
		generateMongoProvider(Notification),
		NotificationResolver,
		NotificationService,
		NotificationRepository,
		NotificationConsumer,
	],
})
export class NotificationModule {}
