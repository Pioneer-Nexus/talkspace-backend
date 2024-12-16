import { AppCacheModule } from "@/infrastructures/cache";
import { AppDatabaseModule } from "@/infrastructures/database";
import { AppLoggerModule } from "@/infrastructures/logger";
import { User, UserSchema } from "@/modules/user/schemas/user.schema";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
	providers: [generateMongoProvider(User, UserSchema), UserService, UserRepository],
	imports: [AppCacheModule, AppDatabaseModule, AppLoggerModule],
	exports: [UserService],
})
export class UserModule {}
