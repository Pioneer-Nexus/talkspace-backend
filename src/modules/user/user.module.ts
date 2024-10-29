import { AppCacheModule } from "@/infrastructures/cache";
import { AppDatabaseModule } from "@/infrastructures/database";
import { AppLoggerModule } from "@/infrastructures/logger";
import { User, UserSchema } from "@/modules/user/user.schema";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UsersService } from "./user.service";

@Module({
	providers: [
		generateMongoProvider(User, UserSchema),
		UsersService,
		UserRepository,
	],
	imports: [AppCacheModule, AppDatabaseModule, AppLoggerModule],
	exports: [UsersService],
})
export class UserModule {}
