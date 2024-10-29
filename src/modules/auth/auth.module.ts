import { AppDatabaseModule } from "@/infrastructures/database";
import { Auth, AuthSchema } from "@/modules/auth/auth.schema";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthRepository } from "./auth.repository";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [AppDatabaseModule, PassportModule, UserModule],
	providers: [
		generateMongoProvider(Auth, AuthSchema),
		AuthRepository,
		LocalStrategy,
		AuthResolver,
		AuthService,
	],
	exports: [AuthRepository],
})
export class AuthModule {}
