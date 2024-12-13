import { AppDatabaseModule } from "@/infrastructures/database";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { Notification } from "./schemas/notification.schema";
import { NotificationResolver } from "./resolvers/notification.resolver";
import { NotificationService } from "./services/notification.service";
import { NotificationRepository } from "./repositories/notification.repository";

@Module({
	imports: [AppDatabaseModule, UserModule],
	providers: [generateMongoProvider(Notification), NotificationResolver, NotificationService, NotificationRepository],
})
export class NotificationModule {}
