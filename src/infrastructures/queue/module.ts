import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { AppConfigModule, IConfigAdapter } from "../config";

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [IConfigAdapter],
			useFactory: (config: IConfigAdapter) => ({
				redis: config.REDIS_URL,
			}),
		}),
	],
})
export class AppQueueModule {}
