import { AppConfigModule, IConfigAdapter } from "@/infrastructures/config";
import { AppDatabaseModule } from "@/infrastructures/database";
import { AppLoggerModule } from "@/infrastructures/logger";
import { Auth } from "@/modules/auth/schemas/auth.schema";
import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./repositories/auth.repository";
import { SignInHistoryRepository } from "./repositories/sign-in-history.repository";
import { TokenRepository } from "./repositories/token.repository";
import { SignInHistory } from "./schemas/sign-in-history.schema";
import { Token } from "./schemas/token.schema";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
	imports: [
		AppConfigModule,
		AppDatabaseModule,
		AppLoggerModule,
		PassportModule,
		UserModule,
		JwtModule.registerAsync({
			imports: [AppConfigModule],
			inject: [IConfigAdapter],
			useFactory: (config: IConfigAdapter) => ({
				secret: config.JWT_SECRET,
				signOptions: { expiresIn: `${config.JWT_EXPIRED}s` },
			}),
		}),
	],
	providers: [
		generateMongoProvider(Auth),
		generateMongoProvider(Token),
		generateMongoProvider(SignInHistory),
		AuthRepository,
		TokenRepository,
		LocalStrategy,
		JwtStrategy,
		AuthResolver,
		AuthService,
		SignInHistoryRepository,
	],
	exports: [AuthRepository, AuthService],
})
export class AuthModule {}
