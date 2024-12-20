import { messageJob } from "@/core/constants/jobs";
import { AppDatabaseModule } from "@/infrastructures/database";
import { generateMongoProvider } from "@/utils/mongo";
import { BullModule } from "@nestjs/bull";
import { forwardRef, Module } from "@nestjs/common";
import { ChatRoomModule } from "../chat-room/chat-room.module";
import { NotificationModule } from "../notification/notification.module";
import { MessageRepository } from "./repositories/message.repository";
import { MessageResolver } from "./resolvers/message.resolver";
import { Message } from "./schemas/message.schema";
import { MessageService } from "./services/message.service";
import { MessageNotifyConsumer } from "./consumers/message-notify.consumer";

@Module({
	imports: [
		AppDatabaseModule,
		NotificationModule,
		ChatRoomModule,
		forwardRef(() => ChatRoomModule),
		BullModule.registerQueue({
			name: messageJob.name,
			defaultJobOptions: {
				attempts: 3,
				backoff: 5000,
				removeOnFail: true,
				removeOnComplete: true,
			},
		}),
	],
	providers: [
		generateMongoProvider(Message),
		MessageResolver,
		MessageService,
		MessageRepository,
		MessageNotifyConsumer,
	],
})
export class MessageModule {}
