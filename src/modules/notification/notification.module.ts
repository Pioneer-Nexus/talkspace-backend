import { AppDatabaseModule } from "@/infrastructures/database";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { Notification } from "./schemas/notification.schema";

@Module({
	imports: [AppDatabaseModule, UserModule],
	providers: [generateMongoProvider(Notification)],
})
export class NotificationModule {}
