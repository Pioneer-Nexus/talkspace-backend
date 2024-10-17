import { generateMongoProvider } from "@/utils/mongo";
import { Module } from "@nestjs/common";
import { Cat, CatSchema } from "./cat.schema";
import { AppDatabaseModule } from "@/infrastructures/database";
import { CatsService } from "./cat.service";
import { CatResolver } from "./cat.resolver";
import { CatRepository } from "./cat.repository";
import { AppLoggerModule } from "@/infrastructures/logger";
import { AppCacheModule } from "@/infrastructures/cache";

@Module({
	providers: [
		generateMongoProvider(Cat, CatSchema),
		CatsService,
		CatRepository,
		CatResolver,
	],
	imports: [AppCacheModule, AppDatabaseModule, AppLoggerModule],
	exports: [CatRepository],
})
export class CatModule {}
