import { Module } from "@nestjs/common";

import { CacheService, ICacheService } from ".";
import { AppConfigModule, IConfigAdapter } from "../config";
import { AppLoggerModule, ILoggerService } from "../logger";

@Module({
	imports: [AppConfigModule, AppLoggerModule],
	providers: [
		{
			provide: ICacheService,
			useFactory: async (
				{ REDIS_URL }: IConfigAdapter,
				logger: ILoggerService,
			) => {
				const cacheService = new CacheService(
					{ url: REDIS_URL },
					logger,
				);
				await cacheService.connect();
				return cacheService;
			},
			inject: [IConfigAdapter, ILoggerService],
		},
	],
	exports: [ICacheService],
})
export class AppCacheModule {}
