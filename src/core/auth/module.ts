import { Module } from "@nestjs/common";
import { generateMongoProvider } from "@/utils/mongo";
import { Auth, AuthSchema } from "@/core/auth/schema";
import { AppDatabaseModule } from "@/infrastructures/database";

@Module({
	providers: [
		generateMongoProvider(Auth, AuthSchema)
	],
	imports: [AppDatabaseModule],
})
export class AuthModule {}