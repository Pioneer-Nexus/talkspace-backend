import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { AppDatabaseModule } from "@/infrastructures/database";
import { AppLoggerModule } from "@/infrastructures/logger";
import { AppCacheModule } from "@/infrastructures/cache";
import { User, UserSchema } from "@/modules/user/user.schema";

@Module({
	providers: [
		generateMongoProvider(User, UserSchema),
	],
	imports: [AppCacheModule, AppDatabaseModule, AppLoggerModule],
})
export class UserModule {}
