import { AppDatabaseModule } from "@/infrastructures/database";
import { SseModule } from "@/infrastructures/server-sent-event/sse.module";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { NotificationController } from "./controllers/notification.controller";
import { NotificationRepository } from "./repositories/notification.repository";
import { NotificationResolver } from "./resolvers/notification.resolver";
import { Notification } from "./schemas/notification.schema";
import { NotificationService } from "./services/notification.service";

@Module({
	imports: [AppDatabaseModule, SseModule, UserModule],
	controllers: [NotificationController],
	providers: [generateMongoProvider(Notification), NotificationResolver, NotificationService, NotificationRepository],
})
export class NotificationModule {}
